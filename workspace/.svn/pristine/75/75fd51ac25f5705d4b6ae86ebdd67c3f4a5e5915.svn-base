package com.turingpoint.dbmodel.db.persister;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.AliasToBeanResultTransformer;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.StringType;

import com.turingpoint.dbmodel.db.dto.RecentResults;
import com.turingpoint.dbmodel.db.mapping.ActiveQuestion;
import com.turingpoint.dbmodel.db.mapping.HibernateUtil;
import com.turingpoint.dbmodel.db.mapping.Response;

import jersey.repackaged.org.objectweb.asm.Type;

public class ResponsePersister extends HibernateUtil {

	@SuppressWarnings("unchecked")
	public static List<Response> getQuestionResponses(Long questionId) {
		Session session = null;
		try {
			session = getSession();
			Criteria criteria = session.createCriteria(Response.class);
			return criteria.add(Restrictions.eq("responseId.questionId", questionId)).list();
		} finally {
			session.close();
		}
	}
	
	public static Response storeNewResponse(Long userId, Long questionId, Long optionId, String textResponse, String selectedAnswers) {
		Response response = new Response();
		response.setResponseId(userId, questionId);
		response.setOptionId(optionId);
		response.setTextResponse(textResponse);
		response.setSelectedAnswers(selectedAnswers);
		return response.save();
	}

	public static Response updateResponse(Long userId, Long questionId, Long optionId, String textResponse, Date date) {
		Response response = new Response();
		response.setResponseId(userId, questionId);
		response.setOptionId(optionId);
		response.setTextResponse(textResponse);
		response.setDate(date);
		return response.save();
	}

	// Get responses for a class for a specific question, not generalized to
	// user
	/**
	 * @deprecated - Doesn't do anything, is this needed?
	 */
	public static List<Object[]> getMultipleChoiceQuestionResults(Long questionId, Long courseId) {

		Session session = HibernateUtil.getSession();
		String enrolledStudentQueryString = "SELECT userId FROM Student WHERE classId = " + courseId;

		return null;
	}
	
	/**
	 * Get the current number of responses received for a provided question (via Id)
	 */
	public static Long getNumberOfResponses(Long questionId){
		Session session = null;
		try {
			session = getSession();
			Criteria criteria = session.createCriteria(Response.class);
			criteria.add(Restrictions.eq("responseId.questionId", questionId));
			criteria.setProjection(Projections.rowCount());
			return (Long) criteria.uniqueResult();
		} finally {
			session.close();
		}
	}
	
	public static List<RecentResults> getMostRecentResponses(Long classId){
		String query = "SELECT lecture.lectureId as lectureId, lecture.name as name, mostrecent.date as date FROM TuringPoint.Lecture lecture "+
			"inner join TuringPoint.Question question on lecture.lectureId=question.lectureId "+
			"inner join (SELECT questionId, date FROM TuringPoint.Response response "+
			"WHERE response.date=(SELECT MAX(date) "+
			 "   FROM TuringPoint.Response WHERE questionId=response.questionId) order by response.date desc) mostrecent "+
			 "   on mostrecent.questionId=question.questionId where classId=:thisClass group by lecture.lectureId;";
		
		
		Session session = null;
		try {
			session = getSession();
			SQLQuery sqlQuery = session.createSQLQuery(query);
			sqlQuery.setParameter("thisClass", classId);
			sqlQuery.addScalar("lectureId", new org.hibernate.type.LongType());
			sqlQuery.addScalar("name", new StringType());
			sqlQuery.addScalar("date", new DateType());
			
			List list = sqlQuery.list();
			List<RecentResults> results = new ArrayList<RecentResults>(list.size());
			for(int i=0; i<list.size(); i++){
				Object[] entity = (Object[]) list.get(i);
				results.add(i, new RecentResults((Long) entity[0], (String) entity[1], (Date) entity[2]));
			}
			System.out.println(results);
			return results;
		} catch (Exception e){
			System.out.println(e);
			return null;
		}
		finally {
			session.close();
		}
		
	}
}
