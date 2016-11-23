package com.turingpoint.dbmodel.db.persister;

import org.junit.Assert;
import org.junit.Test;

import com.turingpoint.dbmodel.db.dto.Credentials;
import com.turingpoint.dbmodel.db.mapping.User;
import com.turingpoint.dbmodel.model.Role;


public class TestUserPersister {

	@Test
	public void testCreateUser(){
		Long timestamp = System.nanoTime();
		User user = UserPersister.createUser("fname" + timestamp, "lname" + timestamp, "user" + timestamp + "@email.com", "password", Role.STUDENT, timestamp);
		Assert.assertNotNull(user);
	}
	
	
	@Test
	public void testUserLogin(){
		Credentials creds = UserPersister.login("test@email.com");
		Assert.assertNotNull(creds);
	}
	
	@Test
	public void testUserInvalidLogin(){
		Credentials creds = UserPersister.login("blahblah@email.com");
		Assert.assertNull(creds);
	}
	
	@Test
	public void testGetUser(){
		User user = User.getUser(1L);
		Assert.assertNotNull(user);
	}
	
	@Test
	public void testUpdateUser(){
		User user = UserPersister.createUser("first", "last", "student@email.com", "password", Role.STUDENT, null);
		user.setfName("iron");
		user.setlName("man");
		User updatedUser = user.update();
		Assert.assertEquals(updatedUser.getfName(), "iron");
	}
}
