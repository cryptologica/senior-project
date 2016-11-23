package com.turingpoint.dbmodel.db.mapping;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@SuppressWarnings("serial")
@Embeddable
public class RoleId implements Serializable{
	
	@Column
	private Long userId;
	
	@Column(name="classId", columnDefinition="courseId")
	private Long courseId;

	public Long getUserId() {
		return userId;
	}

	public Long getClassId() {
		return courseId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public void setCourseId(Long classId) {
		this.courseId = classId;
	}
}
