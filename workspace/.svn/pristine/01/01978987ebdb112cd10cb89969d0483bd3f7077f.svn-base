package com.turingpoint.dbmodel.db.persister;

import java.util.List;

import javax.ws.rs.core.Response;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.json.JSONArray;
import org.json.JSONObject;

import com.turingpoint.dbmodel.db.mapping.ActiveQuestion;
import com.turingpoint.dbmodel.db.mapping.HibernateUtil;
import com.turingpoint.dbmodel.db.mapping.Question;
import com.turingpoint.dbmodel.db.mapping.QuestionOption;
import com.turingpoint.dbmodel.model.QuestionType;

public class QuestionPersister extends HibernateUtil{

	public static Question createQuestion(Long lectureId, int points, String questionContent, String title,
			String feedback, QuestionType type, Long courseId) {
		return createQuestionHelper(lectureId, points, questionContent, title, feedback, type, courseId, false);
	}
	
	public static Question createQuestionBankQuestion(int points, String questionContent, String title,
			String feedback, QuestionType type, Long courseId) {
		return createQuestionHelper(null, points, questionContent, title, feedback, type, courseId, true);
	}
	
	private static Question createQuestionHelper(Long lectureId, int points, String questionContent, String title,
			String feedback, QuestionType type, Long courseId, boolean isQuestionBank){
		Question question = new Question();
		
		if(isQuestionBank){

			Long qBanklectureId = LecturePersister.getQuestionBankLecture(courseId).getLectureId();
			question.setLectureId(qBanklectureId);
			question.setIsQuestionBank(true);
		}else{
			question.setLectureId(lectureId);
			question.setIsQuestionBank(false);
		}
		question.setPoints(points);
		question.setQuestion(questionContent);
		question.setTitle(title);
		question.setType(type);
		question.setVersion(0);
		question.setFeedback(feedback);
		question.save();
		return question;
	}
	
	@SuppressWarnings("unchecked")
	public static List<Question> getQuestionBankQuestions(Long lectureId){
	      Session session = null;
	      try{
	        session = getSession();
	        Criteria criteria = session.createCriteria(Question.class);
	        criteria.add(Restrictions.eq("isQuestionBank", true));
	        criteria.add(Restrictions.eq("lectureId", lectureId));

	        return criteria.list();
	      } finally {
	        session.close();
	      }
	}

	/**
	 * Start a question.
	 * @param courseId
	 * @param questionId
	 */
	public static void startQuestion(Long courseId, Long questionId){
		
		System.out.println("Starting: courseID: " + courseId + ", Question Id: " + questionId);
		
		ActiveQuestion activeQuestion = new ActiveQuestion();
		activeQuestion.setActiveQuestionId(courseId, questionId);
		activeQuestion.save();
	}
	
	public static void endQuestion(Long courseId, Long questionId){
		ActiveQuestion activeQuestion = ActiveQuestion.getActiveQuestion(courseId, questionId);
		activeQuestion.delete();
	}
	
	@SuppressWarnings("unchecked")
	public static List<ActiveQuestion> getActiveQuestions(Long classId) {
		Session session = null;
	    try{
	        session = getSession();
			Criteria criteria = session.createCriteria(ActiveQuestion.class);
			return (List<ActiveQuestion>) criteria.add(Restrictions.eq("classId", classId)).list();
	      } finally {
	        session.close();
	      }
	}

	public static Response importQuestion(Long existingQuesitonId, Long newLectureId, boolean isQuestionBank){
		
		Question existingQuesiton = null;
		List<QuestionOption> existingOptions = null;
		try{
			if(isQuestionBank){
				existingQuesiton = Question.getQuestionBankQuestion(existingQuesitonId);
				// Track import usage (using version for this since it's not used in question bank questions)
				existingQuesiton.setVersion(existingQuesiton.getVersion() + 1);
				existingQuesiton.update();
			}else
				existingQuesiton = Question.getQuestion(existingQuesitonId);
			existingQuesiton.setLectureId(newLectureId);
			existingQuesiton.setQuestionId(null);
			existingQuesiton.setIsQuestionBank(false);
			existingQuesiton.setVersion(0);
			existingQuesiton.setResultsPublished(false);
			existingQuesiton.save();
			
			existingOptions = QuestionOptionPersister.getQuestionOptions(existingQuesitonId);
			for(QuestionOption exisingOption : existingOptions){
				exisingOption.setQuestionId(existingQuesiton.getQuestionId());
				exisingOption.setOptionId(null);
				exisingOption.save();
			}
		} catch (Exception e){
			return Response.status(500).entity("Unable to import a lecture, caused by: " + e).build();
		}
		
    	JSONArray optionIds = new JSONArray();
    	for(QuestionOption o: existingOptions) 
    	{
    		Long tempOptionId = o.getOptionId();
    		optionIds.put(tempOptionId);
    	}
    	
    	JSONObject responseObject = new JSONObject();
    	responseObject.put("questionId", existingQuesiton.getQuestionId());
    	responseObject.put("title", existingQuesiton.getTitle());
    	responseObject.put("version", existingQuesiton.getVersion());
    	responseObject.put("feedback", existingQuesiton.getFeedback());
    	responseObject.put("type", existingQuesiton.getType().ordinal());
    	responseObject.put("optionIds", optionIds);
    	responseObject.put("originalQuestionId", existingQuesitonId);	// Question id cloned from
    	return Response.status(200).entity(responseObject.toString()).build();
		
	}
}
