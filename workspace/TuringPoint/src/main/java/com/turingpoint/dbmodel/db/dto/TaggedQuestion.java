package com.turingpoint.dbmodel.db.dto;

import org.pojomatic.Pojomatic;
import org.pojomatic.annotations.AutoProperty;

/**
 * A simple class to fetch a lecture's status
 * @author tonyniven
 *
 */
@AutoProperty
public class TaggedQuestion {

	Long questionId;
	Long lectureId;
	String title;
	int version;
	
	public TaggedQuestion(){};
	
	public TaggedQuestion(Long questionId, Long lectureId, String title, int version) {
		this.questionId = questionId;
		this.lectureId = lectureId;
		this.title = title;
		this.version = version;
	}
	

	public Long getQuestionId() {
		return questionId;
	}


	public String getTitle() {
		return title;
	}


	public int getVersion() {
		return version;
	}


	public Long getLectureId() {
		return lectureId;
	}

	public void setLectureId(Long lectureId) {
		this.lectureId = lectureId;
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
