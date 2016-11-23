package com.turingpoint.dbmodel.db.dto;

import org.pojomatic.Pojomatic;
import org.pojomatic.annotations.AutoProperty;

/**
 * A simple class to fetch a lecture's status
 * @author scotthadley
 *
 */
@AutoProperty
public class LectureStatus {

	Long questionId;
	
	String title;
	
	int version;
	
	Long lectureId;
	
	boolean isPublished;
	
	public LectureStatus(){};
	
	public LectureStatus(Long questionId, String title, int version, Long lectureId, boolean isPublished) {
		this.questionId = questionId;
		this.title = title;
		this.version = version;
		this.lectureId = lectureId;
		this.isPublished = isPublished;
	}
	

	public Long getQuestionId() {
		return questionId;
	}


	public String getTitle() {
		return title;
	}
	
	public Long getLectureId() {
		return lectureId;
	}

	public boolean getIsPublished() {
		return isPublished;
	}

	public int getVersion() {
		return version;
	}


	public void setQuestionId(Long questionId) {
		this.questionId = questionId;
	}


	public void setTitle(String title) {
		this.title = title;
	}


	public void setVersion(int version) {
		this.version = version;
	}

	public void setLectureId(Long lectureId) {
		this.lectureId = lectureId;
	}
	
	public void setIsPublished(boolean isPublished) {
		this.isPublished = isPublished;
	}

	@Override
	public boolean equals(Object o) {
		return Pojomatic.equals(this, o);
	}

	@Override
	public int hashCode() {
		return Pojomatic.hashCode(this);
	}

	@Override
	public String toString() {
		return Pojomatic.toString(this);
	}
	
}
