package com.turingpoint.dbmodel.db.persister;


import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Subqueries;
import org.hibernate.type.LongType;

import com.turingpoint.dbmodel.db.mapping.Student;
import com.turingpoint.dbmodel.db.mapping.User;
import com.turingpoint.dbmodel.db.mapping.HibernateUtil;
import com.turingpoint.dbmodel.db.mapping.Lecture;
import com.turingpoint.dbmodel.db.mapping.Response;

public class StudentPersister extends HibernateUtil{
	
	public Student addStudentToClass(Long userId, Long classId){
		Student student = new Student();
		student.setId(classId, userId);
		return student.save();
	}
	
	//Written by Tony, if it breaks something , blame him <<-- comment also by tony
	@SuppressWarnings("unchecked")
	public static List<Object[]> getCourseStudents(Long classId)
	{
		Session session = null;
	    try{
	        session = getSession();
			//Query studentQuery = session.createSQLQuery("SELECT userId FROM Student  WHERE classId = " + classId);
			String enrolledStudentQueryString = "SELECT userId FROM Student WHERE classId = :courseId";
			String fullQueryString = "SELECT u.userId, u.fName, u.lName, u.studentId " +
									 "FROM User u INNER JOIN ("+enrolledStudentQueryString+") s " +
									 "ON u.userId = s.userId " + 
									 "ORDER BY u.lName ";
			Query studentQuery = session.createSQLQuery(fullQueryString).setParameter("courseId", classId);
			return studentQuery.list();
	      } finally {
	        session.close();
	      }
	}
	
	/**
	 * Get the current number of students in a course (via Id)
	 */
	public static Long getNumberOfStudents(Long courseId){
		Session session = null;
		try {
			session = getSession();
			Criteria criteria = session.createCriteria(Student.class);
			criteria.add(Restrictions.eq("roleId.courseId", courseId));
			criteria.setProjection(Projections.rowCount());
			return (Long) criteria.uniqueResult();
		} finally {
			session.close();
		}
	}
	
	
	/**
	 * Get a list of the 5 most recently-joined students of a course
	 * @param courseId
	 * @return
	 */
	public static List<User> getRecentlyJoinedStudentsForCourse(Long courseId){
		Session session = null;
		try {
			DetachedCriteria query = DetachedCriteria.forClass(Student.class)
				    .add( Restrictions.eq("roleId.courseId", courseId))
				    .setProjection(Projections.property("roleId.userId"))
				    .addOrder(Order.desc("roleId.userId"));
			
			
			session = getSession();
			Criteria criteria = session.createCriteria(User.class);
			criteria.add(Subqueries.propertyIn("userId", query));
			criteria.setMaxResults(5);
			return (List<User>) criteria.list();
		} finally {
			session.close();
		}
	}
}
