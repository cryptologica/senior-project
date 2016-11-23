package com.turingpoint.dbmodel.db.persister;

import java.util.UUID;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.AliasToBeanResultTransformer;

import com.turingpoint.dbmodel.db.dto.Credentials;
import com.turingpoint.dbmodel.db.mapping.HibernateUtil;
import com.turingpoint.dbmodel.db.mapping.User;
import com.turingpoint.dbmodel.model.Role;

public class UserPersister extends HibernateUtil {

  /**
   * Create a new user from the
   * 
   * @param studentId - can be null for Instructors
   */
  public static User createUser(String fName, String lName, String email, String password, Role role,
    String studentId) {
    User user = new User();
    user.setfName(fName);
    user.setlName(lName);
    user.setEmail(email);
    user.setPassword(password);
    user.setRole(role);
    user.setStudentId(studentId);
    user.setAccountVerified(false);	// They must verify account
    String uuid = UUID.randomUUID().toString();
    user.setVerification(uuid);
    
    return user.save();
  }

  /**
	 * Attempt to get the login details (Credentials, the user's id & pw) from a user's email.
	 * Returns null if there is no such email address.
	 * @param email - User's email address.
	 * @return Credentials object (contains the user's id & password), or Null if no such email exists.
	 */
	public static Credentials login(String email){
	  
	  Session session = null;
	  
	  try{
	    session = getSession();
	    
        Criteria criteria = HibernateUtil.getCriteria(session, User.class);
        
        criteria.add(Restrictions.eq("email", email));
        
        ProjectionList projList = Projections.projectionList();
        projList.add(Projections.property("userId").as("userId"));
        projList.add(Projections.property("password").as("password"));
        projList.add(Projections.property("role").as("role"));
        projList.add(Projections.property("accountVerified").as("accountVerified"));
        projList.add(Projections.groupProperty("userId"));
        
        criteria.setProjection(projList);
        
        criteria.setResultTransformer(new AliasToBeanResultTransformer(Credentials.class));
        
        return (Credentials) criteria.uniqueResult();
	        
	  } finally {
	    session.close();
	  }
	}

}
