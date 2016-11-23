package com.turingpoint.dbmodel.db.mapping;

import java.util.Calendar;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.pojomatic.Pojomatic;
import org.pojomatic.annotations.AutoProperty;

import com.turingpoint.dbmodel.db.mapping.HibernateUtil.DBAction;

@Entity
@Table
@AutoProperty
public class Course extends HibernateUtil {

	@Id
	@GenericGenerator(name="gen",strategy="increment")
	@GeneratedValue(generator="gen")
	@Column(name="classId")
	private Long courseId;

	@Column
	private String name;

	@Column
	private String description;
	
	@Column//(columnDefinition="DATETIME")
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastUpdate;

	public Date getLastUpdate() {
		return lastUpdate;
	}

	public Long getClassId() {
		return courseId;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public void setClassId(Long courseId) {
		this.courseId = courseId;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}
	
	public static Course getCourse(Long courseId) {
	     Session session = null;
	        try{
	          session = getSession();
	          Criteria criteria = session.createCriteria(Course.class);
	          return (Course) criteria.add(Restrictions.eq("courseId", courseId)).uniqueResult();
	        } finally {
	          session.close();
	        }
	}
	
	/**
	 * Get the Date for when the course was last updated (In this case we're tracking the time a
	 * question was last enabled/disabled).
	 * @param courseId
	 * @return
	 */
	public static Date getLastUpdate(Long courseId) {
	     Session session = null;
	        try{
	          session = getSession();
	          Criteria criteria = session.createCriteria(Course.class);
	          criteria.add(Restrictions.eq("courseId", courseId));
	          criteria.setProjection(Projections.property("lastUpdate"));
	          return (Date) criteria.uniqueResult();
	        } finally {
	          session.close();
	        }
	}
	
	@PreUpdate
	public void setUpdate(){
		this.lastUpdate = new Date();
	}
	
	public Course save(){
		HibernateUtil.save(this);
		return this;
	}
	
	public Course update(){
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
