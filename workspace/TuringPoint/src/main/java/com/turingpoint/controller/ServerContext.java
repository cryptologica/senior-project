package com.turingpoint.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.turingpoint.dbmodel.db.mapping.QuestionOption;
import com.turingpoint.dbmodel.db.mapping.Response;
import com.turingpoint.dbmodel.db.persister.QuestionOptionPersister;
import com.turingpoint.dbmodel.model.QuestionType;

/***
 * Global server context for live questions
 * 
 * @author Tony
 *
 */
public class ServerContext 
{
	
	
	
	public final static ServerContext INSTANCE = new ServerContext();

	private boolean enableRapidCache = false;
	
	//Use this to tell what type of question this is
	private HashMap<Long,QuestionType> InProgressQuestionTypes = new HashMap<Long,QuestionType>();
	
	//Use this to store responses from all the users until a question closes
	private HashMap<Long,HashMap<Response.ResponseId,com.turingpoint.dbmodel.db.mapping.Response>> InProgressResponseCache = new HashMap<Long,HashMap<Response.ResponseId,com.turingpoint.dbmodel.db.mapping.Response>>();
	
	//Use this to cache responses so we can quickly see what the response texts or options are, this is for multi choice
	private HashMap<Long,HashMap<Long,com.turingpoint.dbmodel.db.mapping.QuestionOption>> InProgressResponseOptions = new HashMap<Long,HashMap<Long,com.turingpoint.dbmodel.db.mapping.QuestionOption>>();
	
	private HashMap<Long,String> InProgressBlankAnswers = new HashMap<Long,String>();
	
	private ServerContext() 
	{
		// TODO: add crap here

	}
	
	public String getContextTestMessage()
	{
		return "Got the Context!";
	}
	
	/***
	 * Starts a cache entry for a question when it is activated, return value should be verified before server notifies clients
	 * @param questionId
	 * @param type
	 * @return
	 */
	public Boolean putCacheQuestion(Long questionId, QuestionType type)
	{
		if(enableRapidCache)
		{
			synchronized(this) 
			{
				InProgressQuestionTypes.put(questionId, type);
				InProgressResponseCache.put(questionId, new HashMap<Response.ResponseId,com.turingpoint.dbmodel.db.mapping.Response>());
				
				if (type == QuestionType.MULTIPLE_CHOICE)
				{
					InProgressResponseOptions.put(questionId, new HashMap<Long,com.turingpoint.dbmodel.db.mapping.QuestionOption>());
				}
			}
		}
		return true;
		
	}
	
	/***
	 * Records a response for an active question in cache
	 * @param questionId
	 * @param r
	 * @return
	 */
	public Boolean putCacheResponse(Long questionId, com.turingpoint.dbmodel.db.mapping.Response r)
	{
		if(enableRapidCache)
		{
			synchronized(this) 
			{
				//add the response, 
				InProgressResponseCache.get(questionId).put(r.getResponseId(),r);
				
				//look up the response option if its not in the cache
				//if not a multiple choice then get the response from the question so we  can see answer the correct text should be
				if(InProgressQuestionTypes.get(questionId) == QuestionType.FILL_IN_BLANK)
				{
					List<QuestionOption> options = QuestionOptionPersister.getQuestionOptions(questionId);
					InProgressBlankAnswers.put(questionId, options.get(0).getAnswer());
				}
				else if (InProgressQuestionTypes.get(questionId) == QuestionType.MULTIPLE_CHOICE)
				{
					//Decide if what the option is
					Long optionID = r.getOptionId();
					
					//If the server cache has not got this item yet, find out what it is and give it back
					if(!InProgressResponseOptions.get(questionId).containsKey(optionID))
					{
						QuestionOption opty = QuestionOption.getQuestionOption(optionID);
						InProgressResponseOptions.get(questionId).put(optionID, opty);
					}
				}
				
				return true;
			}
		}
		return null;
	}
	
	/***
	 * Should be invoked when question is closed to get final results for display
	 * @param questionId
	 * @return
	 */
	public HashMap<Response.ResponseId,com.turingpoint.dbmodel.db.mapping.Response> dropCache(Long questionId)
	{
		if(enableRapidCache)
		{
			synchronized(this) 
			{
				HashMap<Response.ResponseId,com.turingpoint.dbmodel.db.mapping.Response> gold = getCacheResponses(questionId);
				
				//remove the type specific cacheing for answers
				if(InProgressQuestionTypes.get(questionId) == QuestionType.FILL_IN_BLANK)
				{
					InProgressBlankAnswers.remove(questionId);
				}
				else if(InProgressQuestionTypes.get(questionId) == QuestionType.MULTIPLE_CHOICE)
				{
					InProgressResponseOptions.remove(questionId);
				}
				
				//Remove the responses, types  and options for the question 
				InProgressResponseCache.remove(questionId);
				InProgressQuestionTypes.remove(questionId);
				
				
				return gold;
			}
		}
		return null;
	}
	
	/***
	 * Used for live updating of question response feedback to instructor
	 * @param questionId
	 * @return
	 */
	public HashMap<Response.ResponseId,com.turingpoint.dbmodel.db.mapping.Response> getCacheResponses(Long questionId)
	{
		
		if(enableRapidCache)
		{
			if(InProgressResponseCache.containsKey(questionId))
			{
				return InProgressResponseCache.get(questionId);
			}
			return null;
		}
		return null;
	}
	
	/***
	 * Gets the option text associated with a multi choice question option
	 * @param questionId
	 * @param optionId
	 * @return
	 */
	public String getOptionText(Long questionId, Long optionId)
	{
		
		if(enableRapidCache)
		{
			return InProgressResponseOptions.get(questionId).get(optionId).getName();
		}
		return null;
	}
	
	/***
	 * Tells whether a question response for a cached question is correct
	 * @param questionId
	 * @param optionId
	 * @param textResponse
	 * @return
	 */
	public Boolean getIsCorrectResponse(Long questionId, Long optionId , String textResponse)
	{
		if(enableRapidCache)
		{
			//If this is a fill in blank
			if(InProgressQuestionTypes.get(questionId) == QuestionType.FILL_IN_BLANK)
			{
				return getIsCorrectBlank(questionId,textResponse);
			}
			//if this is multi choice
			else if(InProgressQuestionTypes.get(questionId) == QuestionType.MULTIPLE_CHOICE)
			{
				return getIsMultiChoiceOption(questionId,optionId);
			}
		}
		
		return false;
	}
	
	//Tells whether the text matches the answer for this fill int he blank question
	private Boolean getIsCorrectBlank(Long questionId, String textResponse)
	{
		if(enableRapidCache)
		{
	
			if(textResponse == InProgressBlankAnswers.get(questionId))
			return true;
		
			return false;
		}
		return false;
	}
	
	//Tells whether the selected option is the correct option for this question
	private Boolean getIsMultiChoiceOption(Long questionId, Long optionId)
	{
		if(enableRapidCache)
		{
			return InProgressResponseOptions.get(questionId).get(optionId).getIsCorrect();
		}
		return null;
	}

}