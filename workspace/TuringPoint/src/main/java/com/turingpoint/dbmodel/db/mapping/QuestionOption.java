package com.turingpoint.dbmodel.db.mapping;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.criterion.Restrictions;
import org.pojomatic.Pojomatic;
import org.pojomatic.annotations.AutoProperty;

@Entity
@Table
@AutoProperty
public class QuestionOption extends HibernateUtil {

	@Id
	@GenericGenerator(name="gen",strategy="increment")
	@GeneratedValue(generator="gen")
	private Long optionId;
	
	@Column
	private Long questionId;
	
	/**
	 * The content of the option
	 */
	@Column(name="name")
	private String optionText;
	
	/**
	 * If this is a correct option or not.<br>
	 * Should set if this is a multiple-choice option or a fill-in-the-blank option type so
	 * that we can easily identify the correct answer.
	 */
	@Column
	private Boolean isCorrect;
	
	/**
	 * The text answer (if the option is associated to fill-in-the-blank type)
	 */
	@Column
	private String answer;
	
	@Column
	private int pointValue;
	
	
	public Long getOptionId() {
		return optionId;
	}

	public Long getQuestionId() {
		return questionId;
	}

	public String getName() {
		return optionText;
	}

	public Boolean getIsCorrect() {
		return isCorrect;
	}

	public String getAnswer() {
		return answer;
	}
	
	public int getPointValue() {
		return pointValue;
	}

	public void setOptionId(Long optionId) {
		this.optionId = optionId;
	}

	public void setQuestionId(Long questionId) {
		this.questionId = questionId;
	}

	public void setName(String name) {
		this.optionText = name;
	}

	public void setIsCorrect(Boolean isCorrect) {
		this.isCorrect = isCorrect;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}
	
	public void setPointValue(int pointValue) {
		this.pointValue = pointValue;
	}

	public QuestionOption save(){
		HibernateUtil.save(this);
		return this;
	}
	
	public QuestionOption update(){
		HibernateUtil.performAction(DBAction.UPDATE, this);
		return this;
	}
	
	public void delete(){
		HibernateUtil.performAction(DBAction.DELETE, this);
	}

	
	public static QuestionOption getQuestionOption(Long optionId) {
      Session session = null;
      try{
        session = getSession();
        Criteria criteria = session.createCriteria(QuestionOption.class);
        return (QuestionOption) criteria.add(Restrictions.eq("optionId", optionId)).uniqueResult();
      } finally {
        session.close();
      }
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
