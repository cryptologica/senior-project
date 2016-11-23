package com.turingpoint.dbmodel.db.persister;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import com.turingpoint.dbmodel.db.mapping.HibernateUtil;
import com.turingpoint.dbmodel.db.mapping.QuestionOption;

public class QuestionOptionPersister extends HibernateUtil{

	/**
	 * Get all the options associated to a question. 
	 * @param questionId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static List<QuestionOption> getQuestionOptions(Long questionId) {
		Session session = null;
	    try{
	        session = getSession();
			Criteria criteria = session.createCriteria(QuestionOption.class);
			return criteria.add(Restrictions.eq("questionId", questionId)).list();
	      } finally {
	        session.close();
	      }
	}
	
	
	public static List<QuestionOption> addOptionsToQuestion(Long questionId, List<QuestionOption> options){
		for(QuestionOption option : options){
			option.setQuestionId(questionId);
			option.save();
		}
		return options;
	}
	
}
