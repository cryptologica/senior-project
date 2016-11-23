package com.turingpoint.dbmodel.db.dto;

import java.util.Date;

import org.pojomatic.Pojomatic;
import org.pojomatic.annotations.AutoProperty;

@AutoProperty
public class RecentResults {
	
	private Long lectureId;
	
	private String name;
	
	private Date date;
	
	public RecentResults(Long lectureId, String name, Date date){
		this.lectureId = lectureId;
		this.name = name;
		this.date = date;
	}

	public Long getLectureId() {
		return lectureId;
	}

	public String getName() {
		return name;
	}

	public Date getDate() {
		return date;
	}

	public void setLectureId(Long lectureId) {
		this.lectureId = lectureId;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setDate(Date date) {
		this.date = date;
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
