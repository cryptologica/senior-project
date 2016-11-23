package com.turingpoint.dbmodel.db.persister;

import java.util.ArrayList;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;

import com.turingpoint.dbmodel.db.mapping.ActiveQuestion;
import com.turingpoint.dbmodel.db.mapping.Question;
import com.turingpoint.dbmodel.db.mapping.QuestionOption;
import com.turingpoint.dbmodel.model.QuestionType;


public class TestQuestionPersister {

	@Test
	public void testGetQuestion(){
		Question question = Question.getQuestion(1L);
		Assert.assertNotNull(question);
	}
	
	@Test
	public void testCreateQuestion(){
		Question question = QuestionPersister.createQuestion(1L, 1, "Why did the chicken cross the road?", "Chickens", QuestionType.MULTIPLE_CHOICE);
		Assert.assertNotNull(question);
	}
	
	@Test
	public void testCreateQuestionWithOptions(){
		Question question = QuestionPersister.createQuestion(1L, 1, "Why did the chicken cross the road?", "Chickens", QuestionType.MULTIPLE_CHOICE);
		
		List<QuestionOption> options = new ArrayList<QuestionOption>();
		
		QuestionOption option1 = new QuestionOption();
		option1.setName("To get to the other side.");
		option1.setIsCorrect(false);
		options.add(option1);
		
		QuestionOption option2 = new QuestionOption();
		option2.setName("To get to the bar.");
		option2.setIsCorrect(true);
		options.add(option2);
		
		options = QuestionOptionPersister.addOptionsToQuestion(question.getQuestionId(), options);
		
		Assert.assertNotNull(options);
	}
	
	@Test
	public void testStartQuestion(){
		QuestionPersister.startQuestion(1L, 6L);
	}
	
	@Test
	public void testEndQuestion(){
		QuestionPersister.endQuestion(1L, 1L);
	}
	
	@Test
	public void testGetActiveQuestions(){
		List<ActiveQuestion> acs =  QuestionPersister.getActiveQuestions(1L);
		Assert.assertNotNull(acs);
	}
}
