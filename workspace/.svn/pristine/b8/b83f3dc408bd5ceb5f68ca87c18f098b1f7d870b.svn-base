package com.turingpoint.controller.polling;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.StatusType;

import org.json.JSONArray;
import org.json.JSONObject;

import com.turingpoint.controller.ServerContext;
import com.turingpoint.controller.ServerTypes;
import com.turingpoint.controller.courses.LectureCommon;
import com.turingpoint.dbmodel.db.dto.LectureStatus;
import com.turingpoint.dbmodel.db.mapping.ActiveQuestion;
import com.turingpoint.dbmodel.db.mapping.Course;
import com.turingpoint.dbmodel.db.mapping.Lecture;
import com.turingpoint.dbmodel.db.mapping.Question;
import com.turingpoint.dbmodel.db.mapping.QuestionOption;
import com.turingpoint.dbmodel.db.mapping.User;
import com.turingpoint.dbmodel.db.persister.CoursePersister;
import com.turingpoint.dbmodel.db.persister.LecturePersister;
import com.turingpoint.dbmodel.db.persister.QuestionOptionPersister;
import com.turingpoint.dbmodel.db.persister.QuestionPersister;
import com.turingpoint.dbmodel.db.persister.ResponsePersister;
import com.turingpoint.dbmodel.model.QuestionType;
import com.turingpoint.dbmodel.model.Role;

@Path("/questionbank")
@Produces(MediaType.APPLICATION_JSON)
public class QuestionBankService {

	ServerContext server = ServerContext.INSTANCE;

    @GET
    @Path("/course/{courseID}/questions")
    public Response GetQuestionBankQuestions(@PathParam("courseID") Long courseID)
    {
    	return LectureCommon.getLectureOrQuestionBankQuestions(courseID, null, true);
    }
	
    @GET
    @Path("/{questionID}")
    public Response GetQuestionDetail(@PathParam("questionID") Long questionID)
    {
    	return QuestionCommon.getQuestion(questionID, true);
    }

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response CreateQuestion(InputStream inputJSON)
    {
    	return QuestionCommon.createQuestion(inputJSON, true);
    }

    @PUT
    @Path("/{questionID}/update")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response EditQuestion(InputStream inputJSON, @PathParam("questionID") Long questionID)
    {
    	return QuestionCommon.updateQuestion(questionID, inputJSON, true);
    }
    
    @POST
    @Path("/{questionID}/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response DeleteQuestion(InputStream inputJSON,@PathParam("questionID") Long questionID)  
    {
    	return QuestionCommon.deleteQuestion(questionID, inputJSON, true);
    }

    @GET
    @Path("/course/{courseID}/mostimportedquestions")
    public Response GetQuestionBankMostImportedQuestions(@PathParam("courseID") Long courseID)
    {
    	JSONObject responseObject = new JSONObject();
    	String msg = "";
    	JSONArray questionList = new JSONArray();
    	
    	//Declare
    	Lecture requestedLecture;
    	List<LectureStatus> lectureQuestions;
    	
    	
    	//Get requested lecture
    	try
    	{
    			requestedLecture = LecturePersister.getQuestionBankLecture(courseID);
    	}
    	catch(Exception e)
    	{
    		msg = "Unable to get the question bank lecture for course with courseId " + courseID;
    		responseObject.put("msg",msg);
    		return Response.status(500).entity(responseObject.toString()).build();
    	}
    	
    	if(requestedLecture == null)
    	{
    		msg = "Unable to get the question bank lecture for course with courseId  " + courseID;
    		msg += ". The lecture is null.";
    		responseObject.put("msg",msg);
    		return Response.status(400).entity(responseObject.toString()).build();
    	}
    	
    	try
    	{
        	lectureQuestions = LecturePersister.getQuestionBankMostFrequentlyImportedQuestionsForCourse(courseID);
    	}
    	catch(Exception e)
    	{
    		msg = "Unable to get most frequently imported questions for question bank of course with courseId " + courseID ;
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
