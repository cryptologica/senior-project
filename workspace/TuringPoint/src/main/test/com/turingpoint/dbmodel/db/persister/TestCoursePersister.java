package com.turingpoint.dbmodel.db.persister;

import java.util.List;

import org.junit.Assert;
import org.junit.Test;

import com.turingpoint.dbmodel.db.mapping.Course;


public class TestCoursePersister {

	@Test
	public void testCreateCourse(){
		Course course = CoursePersister.createCourse("New Class Name", "Class Description New", 13L);
		Assert.assertNotNull(course);
	}
	
	@Test
	public void testGetCourses(){
		List<Course> courses = CoursePersister.getAllCourses();
		Assert.assertNotNull(courses);
	}
	
	@Test
	public void testAddStudentToCourse(){
		Course course = CoursePersister.addStudentToCourse(8L, 2L);
		Assert.assertNotNull(course);
	}
	
	@Test
	public void testGetUserCourses(){
		List<Course> courses = CoursePersister.getCoursesOfUser(13L);
		Assert.assertNotNull(courses);
	}
}
