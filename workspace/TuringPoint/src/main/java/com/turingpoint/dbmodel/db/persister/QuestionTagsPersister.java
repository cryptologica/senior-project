package com.turingpoint.dbmodel.db.persister;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.json.JSONObject;

import com.turingpoint.dbmodel.db.dto.TaggedQuestion;
import com.turingpoint.dbmodel.db.mapping.HibernateUtil;
import com.turingpoint.dbmodel.db.mapping.QuestionTags;

public class QuestionTagsPersister extends HibernateUtil{

	public static QuestionTags tagQuestion(Long questionId, Long tagId) {
		QuestionTags newTags = new QuestionTags();
		
		newTags.setQuestionTagId(questionId, tagId);
		newTags.save();
		
		return newTags;
	}
	
	public static void untagQuestion(Long questionId, Long tagId) {
		QuestionTags target = QuestionTags.getQuestionTags(questionId, tagId);
		target.delete();
	}
	
	@SuppressWarnings("unchecked")
	public static List<QuestionTags> getQuestionTagsForQuestion(Long questionId)
	{
		Session session = null;
	    try{
	        session = getSession();
			Criteria criteria = session.createCriteria(QuestionTags.class);
			return (List<QuestionTags>) criteria.add(Restrictions.eq("questionTagId.questionId", questionId)).list();
	      } finally {
	        session.close();
	      }
	}
	
	@SuppressWarnings("unchecked")
	public static List<QuestionTags> getQuestionTagsForTag(Long tagId)
	{
		Session session = null;
	    try{
	        session = getSession();
			Criteria criteria = session.createCriteria(QuestionTags.class);
			return (List<QuestionTags>) criteria.add(Restrictions.eq("questionTagId.tagId", tagId)).list();
	      } finally {
	        session.close();
	      }
	}
	
	@SuppressWarnings("unchecked")
	public static List<TaggedQuestion> getQuestionsForTag(Long tagId)
	{
		Session session = null;
	    try{
	        session = getSession();
			//Query studentQuery = session.createSQLQuery("SELECT userId FROM Student  WHERE classId = " + classId);
			String tagGrab = "SELECT t.questionId FROM QuestionTags t WHERE tagId = :tagId";
			String fullQueryString = "SELECT Q.* FROM Question as Q INNER JOIN ("+tagGrab+") as s " +
									"ON s.questionId = Q.questionId";
			Query studentQuery = session.createSQLQuery(fullQueryString).setParameter("tagId", tagId);
			
			List<Object[]> list = studentQuery.list();
			List<TaggedQuestion> taggedQuestionList = new ArrayList<TaggedQuestion>();
			for(Object[] o : list)
	    	{
				TaggedQuestion obj = new TaggedQuestion(new Long((Integer)o[0]),new Long((Integer)o[1]),(String)o[3],(int)o[5]);
				taggedQuestionList.add(obj);
	    	}
			
			//this is not working for some reason
			//String removeUnusedTags = "DELETE FROM Tags WHERE tagId NOT IN(SELECT q.tagId FROM QuestionTags q WHERE q.tagId is not null)";
			//session.createSQLQuery(removeUnusedTags).executeUpdate();
			
			return taggedQuestionList;
			
	      } finally {
	        session.close();
	      }
	}
	
	
	
	
}
