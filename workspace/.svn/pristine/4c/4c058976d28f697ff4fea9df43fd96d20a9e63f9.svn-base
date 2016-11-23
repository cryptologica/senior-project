package com.turingpoint.dbmodel.db.persister;

import java.util.List;

import org.junit.Assert;
import org.junit.Test;

import com.turingpoint.dbmodel.db.mapping.QuestionOption;


public class TestQuestionOptionPersister {

	@Test
	public void testGetQuestionOption(){
		QuestionOption questionOption = QuestionOption.getQuestionOption(1L);
		Assert.assertNotNull(questionOption);
	}
	
	@Test
	public void testGetQuestionOptions(){
		List<QuestionOption> questionOptions = QuestionOptionPersister.getQuestionOptions(1L);
		Assert.assertNotNull(questionOptions);
	}
	
	
	
}
