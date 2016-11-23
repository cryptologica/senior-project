package com.turingpoint.dbmodel.db.mapping;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.criterion.Restrictions;
import org.pojomatic.Pojomatic;
import org.pojomatic.annotations.AutoProperty;

import com.turingpoint.dbmodel.db.mapping.HibernateUtil.DBAction;
import com.turingpoint.dbmodel.db.mapping.Response.ResponseId;
import com.turingpoint.dbmodel.model.QuestionType;

/*
 * Tag class representing user defined tags - Tony Niven 3/14/2016
 */

@Entity
@Table
@AutoProperty
public class QuestionTags extends HibernateUtil {

	@SuppressWarnings("serial")
	@Embeddable
	@AutoProperty
	public static class QuestionTagID implements Serializable{
		
		@Column
		private Long questionId;
		
		@Column
		private Long tagId;
		
		public Long getQuestionId() {
			return questionId;
		}

		public void setQuestionId(Long questionId) {
			this.questionId = questionId;
		}

		public Long getTagId() {
			return tagId;
		}

		public void setTagId(Long tagId) {
			this.tagId = tagId;
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
	
	@EmbeddedId
	private QuestionTagID questionTagId;
	
	public void setQuestionTagId(Long questionId, Long tagId)
	{
		this.questionTagId = new QuestionTagID();
		this.questionTagId.setQuestionId(questionId);
		this.questionTagId.setTagId(tagId);
	}
	
	public void setQuestionTagId(QuestionTagID nwID)
	{
		this.questionTagId = nwID;
	}
	
	public Long getQuestionID()
	{
		return this.questionTagId.questionId;
	}
	
	public Long getTagId()
	{
		return this.questionTagId.tagId;
	}
	
	public QuestionTagID getQuestionTagID()
	{
		return this.questionTagId;
	}
	
	public static QuestionTags getQuestionTags(Long questionId, Long tagId){
		  Session session = null;
		  try{
		    session = getSession();
	        Criteria criteria = HibernateUtil.getCriteria(session, QuestionTags.class);
	        criteria.add(Restrictions.eq("questionTagId.questionId", questionId));
	        criteria.add(Restrictions.eq("questionTagId.tagId", tagId));
	        return (QuestionTags) criteria.uniqueResult();
		  } finally {
		    session.close();
		  }
		}
	
	public QuestionTags save(){
		HibernateUtil.save(this);
		return this;
	}
	
	public QuestionTags update(){
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

