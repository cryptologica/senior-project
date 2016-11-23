package com.turingpoint.controller.polling;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.StatusType;

import org.json.JSONArray;
import org.json.JSONObject;

import com.turingpoint.authentication.AuthenticationFilter;
import com.turingpoint.controller.ServerContext;
import com.turingpoint.controller.ServerTypes;
import com.turingpoint.dbmodel.db.dto.Credentials;
import com.turingpoint.dbmodel.db.dto.LectureStatus;
import com.turingpoint.dbmodel.db.dto.TaggedQuestion;
import com.turingpoint.dbmodel.db.mapping.ActiveQuestion;
import com.turingpoint.dbmodel.db.mapping.Course;
import com.turingpoint.dbmodel.db.mapping.Lecture;
import com.turingpoint.dbmodel.db.mapping.Question;
import com.turingpoint.dbmodel.db.mapping.QuestionOption;
import com.turingpoint.dbmodel.db.mapping.QuestionTags;
import com.turingpoint.dbmodel.db.mapping.Tag;
import com.turingpoint.dbmodel.db.mapping.User;
import com.turingpoint.dbmodel.db.persister.CoursePersister;
import com.turingpoint.dbmodel.db.persister.LecturePersister;
import com.turingpoint.dbmodel.db.persister.QuestionOptionPersister;
import com.turingpoint.dbmodel.db.persister.QuestionPersister;
import com.turingpoint.dbmodel.db.persister.QuestionTagsPersister;
import com.turingpoint.dbmodel.db.persister.ResponsePersister;
import com.turingpoint.dbmodel.db.persister.TagPersister;
import com.turingpoint.dbmodel.model.QuestionType;
import com.turingpoint.dbmodel.model.Role;

@Path("/question")
@Produces(MediaType.APPLICATION_JSON)
public class QuestionServices {

	ServerContext server = ServerContext.INSTANCE;

    @GET
    @Path("/{questionID}")
    public Response GetQuestionDetail(@PathParam("questionID") Long questionID)
    {
    	return QuestionCommon.getQuestion(questionID, false);
    }

    @POST
    @Path("/{questionID}/answer")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response AnswerQuestion(InputStream inputJSON, @PathParam("questionID") Long questionID)
    {
    	JSONObject responseObject = new JSONObject();
    	String msg = "";
    	Long optionId = (long) 0;
    	ArrayList<Long> optionIds = new ArrayList<Long>();
    	String selectedAnswers = "";
    	String response = "";
    	
    	Question questionInQuestion = Question.getQuestion(questionID);
    	if(questionInQuestion == null)
    	{
    		//TODO: Log bad user id and stack trace
    		msg = "Could not retrieve questionID: "+ questionID;
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}

    	
    	//check question is on before accepting asnwer
    	//find out which course the question is in
    	try
    	{
    		long lectureForQuestion = questionInQuestion.getLectureId();
    		long courseForLecture = Lecture.getLecture(lectureForQuestion).getClassId();
    		ActiveQuestion A = ActiveQuestion.getActiveQuestion(courseForLecture, questionID);
    		
    		if(A==null)
    		{
    			//TODO: Log bad user id and stack trace
        		msg = "Question not open for response";
        		responseObject.put("msg",msg);
        		return Response.status(403).entity(responseObject.toString()).build();
    		}
    	}
    	catch(Exception e)
    	{
    		//TODO: Log bad user id and stack trace
    		msg = "Could not retrieve state for questionID: "+ questionID;
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}

    	//Validate input is json
    	JSONObject inputObject;
    	try
    	{
    		inputObject = ServerTypes.StringToJSON(inputJSON);
    	}
    	catch(Exception e)
    	{
    		//TODO: Log bad user id and stack trace
    		msg = "Malformed Request Packet";
    		System.out.println("QuestionServices | 122 | Malformed JSON | " + ServerTypes.StreamToString(inputJSON));
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	
    	
    	Integer currentQuestionVersion = questionInQuestion.getVersion();
    	
    	Long userId;
    	Integer version;
    	//Validate parameters
    	try
    	{
			userId = inputObject.getLong("userId");
			version= inputObject.getInt("version");
			if(questionInQuestion.getType().equals(QuestionType.MULTIPLE_CHOICE))
			{
				optionId = inputObject.getLong("optionId");
			}
			else if(questionInQuestion.getType().equals(QuestionType.FILL_IN_BLANK) || questionInQuestion.getType().equals(QuestionType.NUMERIC_RESPONSE))
			{
				//clear trailing or leading space
				response = ServerTypes.escapeTags(inputObject.getString("response").trim());
				optionId = QuestionOptionPersister.getQuestionOptions(questionID).get(0).getOptionId();	
			}
			else if (questionInQuestion.getType().equals(QuestionType.MULTIPLE_ANSWER))
			{
				optionId = QuestionOptionPersister.getQuestionOptions(questionID).get(0).getOptionId();	
				JSONArray arr = inputObject.getJSONArray("optionIds");
				for (Object x: arr)
				{
					selectedAnswers += x.toString() + ",";
				}
				
				// Get rid of the extra ", " on the end
				if (selectedAnswers != null)
				{
					selectedAnswers = selectedAnswers.substring(0, selectedAnswers.length() - 1);
				}
			}
    	}
    	catch(Exception e)
    	{
    		msg = "Request lacks required parameters: " + inputJSON.toString();
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	
    	if(version == currentQuestionVersion)
    	{
	
	    	//check if this response is in the cache already.... this is the only way i know of to avoid a massive fkup
	    	com.turingpoint.dbmodel.db.mapping.Response ans;
	    	
	    	//when this comes back with an existing object, we cant create a new response, so we update the existing one
	    	ans = com.turingpoint.dbmodel.db.mapping.Response.getResponse(userId, questionID);
	    	
	    	if(ans == null)
	    	{
	    		ans = ResponsePersister.storeNewResponse(userId, questionID, optionId, response, selectedAnswers);
	    	}
	    	else
	    	{
	    		//Update the response date
	    		ans.setDate(new Date());
	    		
	        	if(inputObject.has("optionId"))
	        		ans.setOptionId(optionId);
	        	else
	        	{
	        		ans.setTextResponse(response);
	        		ans.setSelectedAnswers(selectedAnswers);
	        	}       		
	        	ans.setDate(new Date());	// Update response time to now
	        	ans.update();
	    	}
	
	    	try
	    	{
	    		server.putCacheResponse(questionID, ans);
	    	}
	    	catch(Exception e)
	    	{
	    		System.err.println("QuestionServices | 145 | Cannot rapid cache question, was the server restarted?");
	    	}
	    	
	    	

	    	msg = "Answer Accepted";
	    	responseObject.put("msg", msg);
	    	return Response.status(200).entity(responseObject.toString()).build();
    	}
    	
    	msg = "Old Version";
    	responseObject.put("msg", msg);
    	return Response.status(400).entity(responseObject.toString()).build();

    }

    @POST
    @Path("/{questionID}/start")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response StartQuestion(@Context HttpHeaders headers, InputStream inputJSON, @PathParam("questionID") Long questionID)
    {
    	JSONObject responseObject = new JSONObject();


    	String msg = "";

    	//Validate input is json
    	JSONObject inputObject;
    	try
    	{
    		inputObject = ServerTypes.StringToJSON(inputJSON);
    	}
    	catch(Exception e)
    	{
    		//TODO: Log bad user id and stack trace
    		msg = "Malformed Request Packet";
    		System.out.println("QuestionServices | 226 | Malformed JSON | " + ServerTypes.StreamToString(inputJSON));
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	
    	long courseId;
    	
    	try
    	{
    		courseId = inputObject.getLong("courseId");
    	}
    	catch(Exception e)
    	{
    		msg = "Request lacks required parameters: " + inputJSON.toString();
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	//Start the question cache here to ensure its always open before responses come in
    	server.putCacheQuestion(questionID, Question.getQuestion(questionID).getType());
    	
    	//open question
    	
    	try
    	{
    		QuestionPersister.startQuestion(courseId, questionID);
    	}
    	catch(Exception e)
    	{
    		msg = "Question already started";
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}

    	//reply to client
    	msg = "Question Started";
    	responseObject.put("msg", msg);
    	responseObject.put("questionId", questionID);
    	return Response.status(200).entity(responseObject.toString()).build();
    }

    @POST
    @Path("/{questionID}/end")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response EndQuestion(@Context HttpHeaders headers, InputStream inputJSON, @PathParam("questionID") Long questionID)
    {
    	JSONObject responseObject = new JSONObject();


    	String msg = "";

    	//Validate input is json
    	JSONObject inputObject;
    	try
    	{
    		inputObject = ServerTypes.StringToJSON(inputJSON);
    	}
    	catch(Exception e)
    	{
    		//TODO: Log bad user id and stack trace
    		msg = "Malformed Request Packet "+ inputJSON.toString();
    		System.out.println("QuestionServices | 264 | Malformed JSON | " + ServerTypes.StreamToString(inputJSON));
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	long courseId;
    	
    	try
    	{
    		courseId = inputObject.getLong("courseId");
    	}
    	catch(Exception e)
    	{
    		msg = "Request lacks required parameters: " + inputJSON.toString();
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}

    	QuestionPersister.endQuestion(courseId, questionID);
    	
    	server.dropCache(questionID);
    	
    	msg = "Question ended";
    	responseObject.put("msg", msg);
    	responseObject.put("questionId", questionID);
    	return Response.status(200).entity(responseObject.toString()).build();
    }

    
    ////I say we just call the first one and always use the post method at this point - Tony
    @PUT
    @Path("/{questionID}/answer")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response AnswerQuestionAgain(InputStream inputJSON, @PathParam("questionID") Long questionID)
    {
    	JSONObject responseObject = new JSONObject();
    	String msg = "";
    	Long optionId = (long) 0;
    	String response = "";

    	//Validate input is json
    	JSONObject inputObject;
    	try
    	{
    		inputObject = ServerTypes.StringToJSON(inputJSON);
    	}
    	catch(Exception e)
    	{
    		//TODO: Log bad user id and stack trace
    		msg = "Malformed Request Packet "+ inputJSON.toString();
    		System.out.println("QuestionServices | 303 | Malformed JSON | " + ServerTypes.StreamToString(inputJSON));
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	long userId;
    	int version;
    	
    	try
    	{
    		userId = inputObject.getLong("userId");
        	version = inputObject.getInt("version");
        	if(inputObject.has("optionId"))
        	{
        		optionId = inputObject.getLong("optionId");
        		//optionId = Long.parseLong((String)inputObject.get("optionId"));
        	}
        	else if(inputObject.has("response"))
        	{
        		response = ServerTypes.escapeTags(inputObject.getString("response"));
        	}
    	}
    	catch(Exception e)
    	{
    		msg = "Request lacks required parameters: " + inputJSON.toString();
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	msg = "Update Accepted";
    	responseObject.put("msg", msg);
    	return Response.status(200).entity(responseObject.toString()).build();
    }

    @POST
    @Path("/{questionID}/setGroup")
    @Consumes(MediaType.APPLICATION_JSON)
    //TODO: Finish when question persister supports this operation
    public Response SetQuestionGroup(@PathParam("questionID") Long questionID)
    {
    	String wildCard = "Service Not Yet Implemented";
    	JSONObject responseObject = new JSONObject();
    	responseObject.put("msg", wildCard);
    	return Response.status(200).entity(responseObject.toString()).build();
    }

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response CreateQuestion(@Context HttpHeaders headers, InputStream inputJSON)
    {
    	JSONObject responseObject = new JSONObject();

		
    	return QuestionCommon.createQuestion(inputJSON, false);
    }

    @PUT
    @Path("/{questionID}/update")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response EditQuestion(@Context HttpHeaders headers, InputStream inputJSON, @PathParam("questionID") Long questionID)
    {
    	JSONObject responseObject = new JSONObject();

		
    	return QuestionCommon.updateQuestion(questionID, inputJSON, false);
    }
    
    @POST
    @Path("/{questionID}/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    //TODO: Finish when question persister supports this operation (Not phase 1)
    public Response DeleteQuestion(@Context HttpHeaders headers, InputStream inputJSON,@PathParam("questionID") Long questionID)  
    {
    	JSONObject responseObject = new JSONObject();

		
    	return QuestionCommon.deleteQuestion(questionID, inputJSON, false);
    }
    
    @POST
    @Path("/{questionID}/publish")
    public Response PublishQuestion(@Context HttpHeaders headers, @PathParam("questionID") Long questionID)
    {
    	JSONObject responseObject = new JSONObject();
		
    	String msg = "";
    	
    	Question questionToUpdate = Question.getQuestion(questionID);
    	
    	if (questionToUpdate == null) {
    		return Response.status(500).entity("Unable to get the question.").build();
    	}
    			
    	questionToUpdate.setResultsPublished(true);
    	questionToUpdate.update();
    	
    	msg = "Question Published";
    	responseObject.put("msg", msg);
    	responseObject.put("questionId", questionID);
    	return Response.status(200).entity(responseObject.toString()).build();
    }
    
    @POST
    @Path("/{questionID}/unpublish")
    public Response UnPublishQuestion(@Context HttpHeaders headers, @PathParam("questionID") Long questionID)
    {
    	JSONObject responseObject = new JSONObject();
		
    	String msg = "";
    	
    	Question questionToUpdate = Question.getQuestion(questionID);
    	
    	if (questionToUpdate == null) {
    		return Response.status(500).entity("Unable to get the question.").build();
    	}
    			
    	questionToUpdate.setResultsPublished(false);
    	questionToUpdate.update();
    	
    	msg = "Question UnPublished";
    	responseObject.put("msg", msg);
    	responseObject.put("questionId", questionID);
    	return Response.status(200).entity(responseObject.toString()).build();
    }
    
    @GET
    @Path("/alltags")
    public Response getTags()
    {
    	JSONObject responseObject = new JSONObject();
    	JSONArray questionTags = new JSONArray();
    	
    	String msg = "";
    	
    	List<Tag> qTags = TagPersister.getAllTags();
    	for(int i = 0; i < qTags.size(); i++)
    	{
    		JSONObject obj  = new JSONObject();
    		obj.put("tagId", qTags.get(i).getTagId());
    		obj.put("tagName", qTags.get(i).getTagName());
    		
    		questionTags.put(obj);
    	}

    	responseObject.put("tags", questionTags);
    	return Response.status(200).entity(responseObject.toString()).build();
    }

    @POST
    @Path("/{questionID}/tag")
    public Response tagQuestion(@Context HttpHeaders headers, InputStream inputJSON, @PathParam("questionID") Long questionID)
    {
    	JSONObject responseObject = new JSONObject();
    	
    	
    	String msg = "";
    	//Validate input is json
    	JSONObject inputObject;
    	try
    	{
    		inputObject = ServerTypes.StringToJSON(inputJSON);
    	}
    	catch(Exception e)
    	{
    		//TODO: Log bad user id and stack trace
    		msg = "Malformed Request Packet "+ inputJSON.toString();
    		System.out.println("QuestionServices | 303 | Malformed JSON | " + ServerTypes.StreamToString(inputJSON));
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	long tagId;
    	String tagName = "NEWTAG";
    	
    	try
    	{
    		tagId = inputObject.getLong("tagId");
        	if(tagId == -1)
        	{
        		tagName = inputObject.getString("tagName");
        	}
    	}
    	catch(Exception e)
    	{
    		msg = "Request lacks required parameters: " + inputJSON.toString();
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	//IF the tag name is too long ignore it.
    	if(tagName.length() > 45)
    	{
    		msg = "Tag name is too long, ignoring";
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	
    	if(tagId == -1)
    	{
    		Tag newTag = new Tag();
    		newTag.setTagName(tagName.toLowerCase());
    		newTag = newTag.save();
    		tagId = newTag.getTagId();
    	}
    	
    	QuestionTags tagy;
    	try
    	{
    		tagy = QuestionTagsPersister.tagQuestion(questionID, tagId);
    	}
    	catch(Exception e)
    	{
    		msg = "Tag Already Present";
    		responseObject.put("msg",msg);
    		return Response.status(200).entity(responseObject.toString()).build();
    	}

    	responseObject.put("tagId", tagy.getQuestionTagID());
    	
    	return Response.status(200).entity(responseObject.toString()).build();
    }
    
    @POST
    @Path("/{questionID}/untag/{tagID}")
    public Response untagQuestion(@Context HttpHeaders headers, @PathParam("questionID") Long questionID, @PathParam("tagID") Long tagID)
    {
    	JSONObject responseObject = new JSONObject();

    	String msg = "Untagged";
    	
    	try
    	{
    		QuestionTagsPersister.untagQuestion(questionID, tagID);
    	}
    	catch(Exception e)
    	{
    		msg = "Question did not have this tag";
    		responseObject.put("msg", msg);
    	}
    	
    	
    	return Response.status(200).entity(responseObject.toString()).build();
    }
    
    @GET
    @Path("/{questionID}/tags")
    public Response getQuestionTags(@PathParam("questionID") Long questionID)
    {
    	JSONObject responseObject = getQuestionTagsCore(questionID);
    	
    	return Response.status(200).entity(responseObject.toString()).build();
    }
    
    private JSONObject getQuestionTagsCore(Long questionId)
    {
    	JSONObject responseObject = new JSONObject();
    	String msg = "Untagged";
    	List<QuestionTags> tags;
    	
    	try
    	{
    		tags = QuestionTagsPersister.getQuestionTagsForQuestion(questionId);
    		JSONArray tagArray = new JSONArray();
    		
    		for(QuestionTags T : tags)
    		{
    			JSONObject obj = new JSONObject();
    			
    			obj.put("tagId", T.getTagId());
    			Tag biker = Tag.getTag(T.getTagId());
    			obj.put("tagName", biker.getTagName());
    			
    			tagArray.put(obj);
    		}
    		
			responseObject.put("tags",tagArray);
    		
    		//QuestionTagsPersister.untagQuestion(questionID, tagID);
    	}
    	catch(Exception e)
    	{
    		msg = "Get tag operation failed!";
    		responseObject.put("msg", msg);
    	}
    	
    	return responseObject;
    }
    
    /**
     * Not implemented yet
     * @param questionID
     * @return
     */
    @POST
    @Path("/{questionID}/cleartags")
    public Response clearTags(@PathParam("questionID") Long questionID)
    {
    	JSONObject responseObject = new JSONObject();
    	String msg = "Not yet implemented";
    	return Response.status(200).entity(responseObject.toString()).build();
    }
    
    
    @GET
    @Path("/{tagId}/allEntries")
    public Response getQuestionsWithTag(@PathParam("tagId") Long tagId)
    {
    	//TODO: add filtering for returning questions that are part of this class only
    	JSONObject responseObject = new JSONObject();
    	JSONArray responseArray = new JSONArray();
    	String msg = "";
    	
    	Map<Long,Lecture> parsedLectures = new HashMap<Long,Lecture>();
    	List<TaggedQuestion> taggedList = QuestionTagsPersister.getQuestionsForTag(tagId);
    	for(TaggedQuestion t : taggedList)
    	{
    		if(!parsedLectures.containsKey(t.getLectureId()))
    		{
    			parsedLectures.put(t.getLectureId(), Lecture.getLecture(t.getLectureId()));
    		}
    		Lecture lecty = parsedLectures.get(t.getLectureId());
    		JSONObject obj = new JSONObject();
    		obj.put("id", t.getQuestionId());
    		obj.put("lec", t.getLectureId());
    		obj.put("lecname", lecty.getName());
    		obj.put("class", lecty.getClassId());
    		obj.put("name", t.getTitle());
    		
    		responseArray.put(obj);
    	}
    	responseObject.put("questions", responseArray);

    	return Response.status(200).entity(responseObject.toString()).build();
    }
    
    /*
     * This is the same as  @Path("/{tagId}/allEntries) except that it also returns the tag's name
     */
    @POST
    @Path("/{tagId}/allEntries/name")
    public Response getQuestionsWithTag(@Context HttpHeaders headers,InputStream inputJSON,@PathParam("tagId") Long tagId)
    {
    	//TODO: add filtering for returning questions that are part of this class only
    	JSONObject responseObject = new JSONObject();
    	JSONArray responseArray = new JSONArray();
    	String msg = "";
    	
    	//Validate input is json
    	JSONObject inputObject;
    	try
    	{
    		inputObject = ServerTypes.StringToJSON(inputJSON);
    	}
    	catch(Exception e)
    	{
    		//TODO: Log bad user id and stack trace
    		msg = "Malformed Request Packet";
    		System.out.println("QuestionServices | 122 | Malformed JSON | " + ServerTypes.StreamToString(inputJSON));
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	System.out.println(inputObject);
    	
    	
    	Map<Long,Lecture> parsedLectures = new HashMap<Long,Lecture>();
    	List<TaggedQuestion> taggedList = QuestionTagsPersister.getQuestionsForTag(tagId);
    	for(TaggedQuestion t : taggedList)
    	{
    		if(!parsedLectures.containsKey(t.getLectureId()))
    		{
    			parsedLectures.put(t.getLectureId(), Lecture.getLecture(t.getLectureId()));
    		}
    		System.out.println("HEY LOOK AT THIS : "+t);
    		Lecture lecty = parsedLectures.get(t.getLectureId());
    		JSONObject obj = new JSONObject();
    		obj.put("id", t.getQuestionId());
    		obj.put("lec", t.getLectureId());
    		obj.put("lecname", lecty.getName());
    		obj.put("class", lecty.getClassId());
    		obj.put("name", t.getTitle());
    		obj.put("tagName", inputObject.getString("name"));
    		
    		responseArray.put(obj);
    	}
    	responseObject.put("questions", responseArray);

    	return Response.status(200).entity(responseObject.toString()).build();
    }
    
    @GET
    @Path("/{lectureId}/lectureTags")
    public Response getLectureTags(@PathParam("lectureId") Long lectureId)
    {
    	//TODO: add filtering for returning questions that are part of this class only
    	
		List<LectureStatus> lectureStatus = LecturePersister.getQuestionsForLecture(lectureId);
		JSONObject responseObject = new JSONObject();
		JSONArray responseArray = new JSONArray();
    	
    	//put responses together into a bundle
		for (LectureStatus L : lectureStatus)
		{
			//get results for this question
			JSONObject obj = getQuestionTagsCore(L.getQuestionId());
			obj.put("qid", L.getQuestionId());
			responseArray.put(obj);
		}
		responseObject.put("lec",lectureId);
		responseObject.put("tags", responseArray);

    	return Response.status(200).entity(responseObject.toString()).build();
    }
    
    /**
     * Import an existing question (via its quesitonId) into a new lecture (via its lectureId)
     * @param lectureId
     * @param questionId
     * @return
     */
    @POST
    @Path("/{lectureId}/import/{questionId}")
    public Response importQuestion(@PathParam("lectureId") Long lectureId, @PathParam("questionId") Long questionId)
    {
    	return importQuestionHelper(lectureId, questionId, false);
    }
    
    /**
     * Import an existing question (via its quesitonId) into a new lecture (via its lectureId)
     * @param lectureId
     * @param questionId
     * @return
     */
    @POST
    @Path("/{lectureId}/importqbank/{questionId}")
    public Response importQBankQuestion(@PathParam("lectureId") Long lectureId, @PathParam("questionId") Long questionId)
    {
    	return importQuestionHelper(lectureId, questionId, true);
    }
    
    private Response importQuestionHelper(Long lectureId, Long questionId, boolean isQuestionBank){
    	JSONObject responseObject = new JSONObject();

    	if(lectureId == null || questionId == null){
    		String msg = "Request lacks valid parameters.";
    		responseObject.put("msg",msg);
    		return Response.status(400).entity(responseObject.toString()).build();
    	}
		return QuestionPersister.importQuestion( questionId, lectureId, isQuestionBank);
    }
}