package com.turingpoint.dbmodel.db.persister;

import java.util.List;

import org.junit.Assert;
import org.junit.Test;

import com.turingpoint.dbmodel.db.dto.LectureStatus;
import com.turingpoint.dbmodel.db.mapping.Lecture;


public class TestLecturePersister {

	@Test
	public void testCreateLecture(){
		Lecture lecture = LecturePersister.createLecture(1L, "Lecture 4");
		Assert.assertNotNull(lecture);
	}
	
	@Test
	public void testGetLecturesForCourse(){
		List<Lecture> lectures = LecturePersister.getLecturesForCourse(1L);
		Assert.assertNotNull(lectures);
	}
	
	@Test
	public void testGetLectureStatus(){
		List<LectureStatus> statuses = LecturePersister.getQuestionsForLecture(1L);
		Assert.assertNotNull(statuses);
	}
	
	@Test
	public void testGetLectureName(){
		String name = LecturePersister.getLectureName(1L);
		Assert.assertNotNull(name);
	}
	
	@Test
	public void testGetActiveQuestions(){
		List<LectureStatus> status = LecturePersister.getActiveQuestions(1L);
		Assert.assertNotNull(status);
	}
	
	@Test
	public void testUpdateLectureName(){
		Lecture lecture = LecturePersister.updateLectureName(4L, "Lecture 99");
		Assert.assertNotNull(lecture);
	}
}
