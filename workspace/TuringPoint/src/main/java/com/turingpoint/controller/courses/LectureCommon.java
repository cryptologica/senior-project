package com.turingpoint.controller.courses;

import java.util.List;

import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import com.turingpoint.dbmodel.db.dto.LectureStatus;
import com.turingpoint.dbmodel.db.mapping.Lecture;
import com.turingpoint.dbmodel.db.persister.LecturePersister;

public class LectureCommon {

	/**
	 * Get either the questions for the lecture, or the question bank questions.
	 * @param lectureID - Pass if wanting to get the questions for a lecture, null otherwise
	 * @param courseID - Pass if wanting to get the question bank questions for a course, null otherwise
	 * @param isQuestionBank - True to get Question Bank questions, False to get Lecture questions
	 * @return
	 */
	public static Response getLectureOrQuestionBankQuestions(Long courseID, Long lectureID, boolean isQuestionBank){
    	JSONObject responseObject = new JSONObject();
    	String msg = "";
    	JSONArray questionList = new JSONArray();
    	
    	//Declare
    	Lecture requestedLecture;
    	List<LectureStatus> lectureQuestions;
    	
    	
    	//Get requested lecture
    	try
    	{
    		if(isQuestionBank)
    			requestedLecture = LecturePersister.getQuestionBankLecture(courseID);
    		else
    			requestedLecture = Lecture.getLecture(lectureID);
    	}
    	catch(Exception e)
    	{
    		if(isQuestionBank)
    			msg = "Unable to get the question bank lecture for course with courseId " + courseID;
    		else
    			msg = "Unable to get lecture with lectureID: "+ lectureID;
    		responseObject.put("msg",msg);
    		return Response.status(500).entity(responseObject.toString()).build();
    	}
    	
    	if(requestedLecture == null)
    	{
    		if(isQuestionBank)
    			msg = "Unable to get the question bank lecture for course with courseId " + courseID;
    		else
    			msg = "Unable to get lecture with lectureID: "+ lectureID;
    		msg += ". The lecture is null.";
    		responseObject.put("msg",msg);
    		return Response.status(400).entity(responseObject.toString()).build();
    	}
    	
    	try
    	{
    		if(isQuestionBank)
        		lectureQuestions = LecturePersister.getQuestionBankQuestionsForCourse(courseID);
    		else
    			lectureQuestions = LecturePersister.getQuestionsForLecture(lectureID);
    	}
    	catch(Exception e)
    	{
    		msg = "Unable to get questions for " + (isQuestionBank ? "question bank of course with courseId " + courseID : "lectureID: " + lectureID );
    		responseObject.put("msg",msg);
    		return Response.status(500).entity(responseObject.toString()).build();
    	}
    	

    	//Iterate
    	for(LectureStatus l : lectureQuestions)
    	{
    		JSONObject question = new JSONObject();
    		
    		question.put("questionId",l.getQuestionId());
    		question.put("title",l.getTitle());
    		question.put("version",l.getVersion());
    		question.put("isPublished", l.getIsPublished());
    		questionList.put(question);
    	}
    	
    	//Respond
    	responseObject.put("name",requestedLecture.getName());
    	responseObject.put("publishDate", requestedLecture.getDatePublished());
    	responseObject.put("QS", questionList);
		responseObject.put("lectureId", requestedLecture.getLectureId());
		
    	return Response.status(200).entity(responseObject.toString()).build();
	}
	
}
