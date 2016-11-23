package com.turingpoint.dbmodel.db.mapping;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@SuppressWarnings("serial")
@Embeddable
public class ActiveQuestionId implements Serializable{
	
	@Column
	private Long classId;
	
	@Column
	private Long questionId;
	
	public ActiveQuestionId() {};

	public Long getClassId() {
		return classId;
	}

	public Long getQuestionId() {
		return questionId;
	}

	public void setClassId(Long classId) {
		this.classId = classId;
	}

	public void setQuestionId(Long questionId) {
		this.questionId = questionId;
	}
	
}