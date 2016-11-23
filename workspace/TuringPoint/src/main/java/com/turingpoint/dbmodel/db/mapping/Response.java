package com.turingpoint.dbmodel.db.mapping;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.pojomatic.Pojomatic;
import org.pojomatic.annotations.AutoProperty;

import com.turingpoint.dbmodel.db.mapping.HibernateUtil;

@Entity
@Table
@AutoProperty
public class Response extends HibernateUtil {

	@EmbeddedId
	private ResponseId responseId;
	
	@Column
	private Long optionId;

	
	@Column
	private String textResponse;
	
	@Column(columnDefinition="DATETIME")
	@Temporal(TemporalType.TIMESTAMP)
	private Date date;

	//Added in support of multiple answer
	@Column 
	private String selectedAnswers;

	@SuppressWarnings("serial")
	@Embeddable
	@AutoProperty
	public static class ResponseId implements Serializable{
		
		@Column
		private Long userId;
		
		@Column
		private Long questionId;

		public Long getUserId() {
			return userId;
		}

		public Long getQuestionId() {
			return questionId;
		}

		public void setUserId(Long userId) {
			this.userId = userId;
		}

		public void setQuestionId(Long questionId) {
			this.questionId = questionId;
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
	
	
	public void setResponseId(Long userId, Long questionId){
		this.responseId = new ResponseId();
		this.responseId.setQuestionId(questionId);
		this.responseId.setUserId(userId);
	}
	
	
	public ResponseId getResponseId() {
		return responseId;
	}

	public Long getOptionId() {
		return optionId;
	}

	public String getTextResponse() {
		return textResponse;
	}

	public Date getDate() {
		return date;
	}
	
	public String getSelectedAnswers() {
		return selectedAnswers;
	}


	public void setResponseId(ResponseId responseId) {
		this.responseId = responseId;
	}

	public void setOptionId(Long optionId) {
		this.optionId = optionId;
	}

	public void setTextResponse(String textResponse) {
		this.textResponse = textResponse;
	}

	public void setDate(Date date) {
		this.date = date;
	}
	
	public void setSelectedAnswers(String selectedAnswers) {
		this.selectedAnswers = selectedAnswers;
	}
	
	public static Response getResponse(Long userId, Long questionId){
	  Session session = null;
	  try{
	    session = getSession();
        Criteria criteria = HibernateUtil.getCriteria(session, Response.class);
        criteria.add(Restrictions.eq("responseId.userId", userId));
        criteria.add(Restrictions.eq("responseId.questionId", questionId));
        return (Response) criteria.uniqueResult();
	  } finally {
	    session.close();
	  }
	}

	public Response save(){
		HibernateUtil.save(this);
		return this;
	}
	
	public Response update(){
		HibernateUtil.performAction(DBAction.UPDATE, this);
		return this;
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
