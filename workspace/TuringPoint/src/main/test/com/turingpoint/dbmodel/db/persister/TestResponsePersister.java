package com.turingpoint.dbmodel.db.persister;

import java.util.List;

import org.junit.Test;

import com.turingpoint.dbmodel.db.mapping.Response;

import org.junit.Assert;

public class TestResponsePersister {

	@Test
	public void testGetResponses(){
		List<Response> responses = ResponsePersister.getQuestionResponses(1L);
		Assert.assertNotNull(responses);
	}
	
	@Test
	public void testNewResponse(){
		Response response = ResponsePersister.storeNewResponse(4L, 1L, 2L, null, null);
		Assert.assertNotNull(response);
	}
	
	@Test
	public void testGetResponse(){
		Response response = Response.getResponse(11L, 7L);
		Assert.assertNotNull(response);
	}
}
