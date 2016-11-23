package com.turingpoint.dbmodel.db.mapping;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.pojomatic.Pojomatic;
import org.pojomatic.annotations.AutoProperty;

import com.turingpoint.dbmodel.db.mapping.HibernateUtil.DBAction;

@Entity
@Table
@AutoProperty
public class Student extends HibernateUtil {

	@EmbeddedId
	private RoleId roleId;

	public RoleId getStudentId() {
		return roleId;
	}

	public void setStudentId(RoleId roleId) {
		this.roleId = roleId;
	}
	
	public void setId(Long classId, Long userId) {
		this.roleId = new RoleId();
		this.roleId.setCourseId(classId);
		this.roleId.setUserId(userId);
	}
	
	public Student save(){
		HibernateUtil.save(this);
		return this;
	}
	
	public Student update(){
		HibernateUtil.performAction(DBAction.UPDATE, this);
		return this;
	}
	
	public void delete(){
		HibernateUtil.performAction(DBAction.DELETE, this);
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
