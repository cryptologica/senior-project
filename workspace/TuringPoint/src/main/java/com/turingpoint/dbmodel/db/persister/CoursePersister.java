package com.turingpoint.dbmodel.db.persister;

import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import org.hibernate.type.LongType;

import com.turingpoint.dbmodel.db.mapping.Course;
import com.turingpoint.dbmodel.db.mapping.HibernateUtil;
import com.turingpoint.dbmodel.db.mapping.Instructor;
import com.turingpoint.dbmodel.db.mapping.Student;
import com.turingpoint.dbmodel.db.mapping.User;
import com.turingpoint.dbmodel.model.Role;

/**
 * Course persister for creating and accessing courses.
 * 
 * @author scotthadley
 */
public class CoursePersister extends HibernateUtil {

	/**
	 * Add a course and assign the current user to it (the Instructor who
	 * created it)
	 * 
	 * @param name
	 *            - name of the course.
	 * @param description
	 *            - description of the course.
	 * @param userId
	 *            - id of the instructor who wants to create the course.
	 * @return - Course POJO
	 */
	public static Course createCourse(String name, String description, Long userId) {

		Session session = null;

		try {
			session = getSession();
			Transaction transaction = session.beginTransaction();

			Course course = new Course();
			course.setName(name);
			course.setDescription(description);
			long classId = (Long) session.save(course);
			session.flush();

			Instructor instructor = new Instructor();
			instructor.setId(classId, userId);
			session.save(instructor);
			session.flush();

			transaction.commit();
			return course;
		} finally {
			session.close();
		}
	}

	/**
	 * Update an existing course
	 */
	public static Course updateCourse(Long courseId, String name, String description) {
		Course course = new Course();
		course.setClassId(courseId);
		course.setDescription(description);
		course.setName(name);
		return course.update();
	}

	/**
	 * Get a list of all available courses.
	 */
	@SuppressWarnings("unchecked")
	public static List<Course> getAllCourses() {
		Session session = null;
		try {
			session = getSession();
			Criteria criteria = HibernateUtil.getCriteria(session, Course.class);
			return criteria.list();
		} finally {
			session.close();
		}

	}
	
	/**
	 * Get instructor name for the given course.
	 * 
	 * @param courseId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static String getInstructorForCourse(Long courseId) {
	    Session session = null;
	    try{
	      session = getSession();
	      String instructorInCourseQueryString = "SELECT userId FROM Instructor WHERE classId = " + courseId;
		  String fullQueryString = "SELECT u.fName, u.lName " +
									 "FROM User u INNER JOIN ("+instructorInCourseQueryString+") s " +
									 "ON u.userId = s.userId " + 
									 "ORDER BY u.lName ";
			List<Object[]> result = session.createSQLQuery(fullQueryString).list();
			if (result.size() < 1)
				return "";
			String fName = (String) result.get(0)[0];
			String lName = (String) result.get(0)[1];
			String name = fName + " " + lName;
			return name;
	    } finally {
	      session.close();
	    }
	}
	
	/**
	 * 
	 * 
	 * @param courseId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static List<Object> getAllCoursesWithInstructorName() {
	    Session session = null;
	    try{
	      session = getSession();
		  String fullQueryString = "SELECT classId, fName, lName, name, description FROM User u INNER JOIN (SELECT x.userId, c.classId, c.name, c.description FROM Course c INNER JOIN (SELECT * FROM Instructor) x on x.classId = c.classId) y on y.userId = u.userId WHERE role = 'INSTRUCTOR';";
			List<Object> result = session.createSQLQuery(fullQueryString).list();
			return result;
	    } finally {
	      session.close();
	    }
	}

	/**
	 * Add a student to a course.
	 * 
	 * @param courseId
	 *            - ID of course to add the student to.
	 * @param userId
	 *            - ID of student to add to the course.
	 * @return - Course POJO
	 */
	public static Course addStudentToCourse(Long courseId, Long userId) {
		Student student = new Student(); // TODO: Convert to transaction when
											// things get more serious
		student.setId(courseId, userId);
		student.save();

		return Course.getCourse(courseId);
	}

	/**
	 * Get all of a User's courses (regardless of their role)
	 * 
	 * @param userId
	 *            - User's ID to get their list of courses.
	 * @return - List of user's courses.
	 */
	@SuppressWarnings("unchecked")
	public static List<Course> getCoursesOfUser(Long userId) {
		Role role = User.getUser(userId).getRole(); // TODO: Convert to
													// transaction when things
													// get more serious

		Session session = null;
		try {
			session = getSession();
			Criteria criteria = HibernateUtil.getCriteria(session, Course.class);

			if (role.equals(Role.INSTRUCTOR))
				criteria.add(Restrictions.sqlRestriction(
						"{alias}.classId in (select classId from Instructor instructor where instructor.userId=?)",
						userId, LongType.INSTANCE));
			else
				criteria.add(Restrictions.sqlRestriction(
						"{alias}.classId in (select classId from Student student where student.userId=?)", userId,
						LongType.INSTANCE));
			return criteria.list();
		} finally {
			session.close();
		}

		/*
		 * A method to get classes regardless of user's role. Criteria criteria
		 * = HibernateUtil.getCriteria(Course.class);
		 * criteria.add(Restrictions.disjunction()
		 * .add(Restrictions.sqlRestriction(
		 * "{alias}.classId in (select classId from Student student where student.userId=?)"
		 * , userId, LongType.INSTANCE)) .add(Restrictions.sqlRestriction(
		 * "{alias}.classId in (select classId from Instructor instructor where instructor.userId=?)"
		 * , userId, LongType.INSTANCE))); return criteria.list();
		 */
	}
	
	/**
	 * <b>Update the time where a course was last updated to the current time.</b>
	 * I'm thinking we should only set this when activating a question, updating a question, or deleting a question.
	 * @param courseId
	 * @return
	 */
	public static boolean updateCourseUpdateTime(Long courseId){
		try{
			Course course = Course.getCourse(courseId);
			course.setLastUpdate(new Date());
			course.update();
			return true;
		} catch (Exception e){
			System.out.println(e.getMessage());
			return false;
		}
	}

}
