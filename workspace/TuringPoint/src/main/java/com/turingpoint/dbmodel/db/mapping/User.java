package com.turingpoint.dbmodel.db.mapping;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.criterion.Restrictions;
import org.pojomatic.Pojomatic;
import org.pojomatic.annotations.AutoProperty;

import com.turingpoint.dbmodel.db.mapping.HibernateUtil.DBAction;
import com.turingpoint.dbmodel.model.Role;

@Entity
@Table
@AutoProperty
public class User extends HibernateUtil {

	@Id
	@GenericGenerator(name="gen",strategy="increment")
	@GeneratedValue(generator="gen")
	private Long userId;

	@Column
	private String email;

	@Column
	private String password;

	@Column
	@Enumerated(EnumType.STRING)
	private Role role;

	@Column
	private String fName;

	@Column
	private String lName;

	@Column
	private String imageURL;
	
	@Column
	private String studentId;
	
	@Column
	private String verification;
	
	@Column
	private Boolean accountVerified;
	
	public Long getUserId() {
		return userId;
	}

	public Boolean getAccountVerified(){
		return this.accountVerified;
	}

	public String getEmail() {
		return email;
	}


	public String getPassword() {
		return password;
	}


	public Role getRole() {
		return role;
	}


	public String getfName() {
		return fName;
	}


	public String getlName() {
		return lName;
	}


	public String getImageURL() {
		return imageURL;
	}

	public String getVerification() {
		return verification;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public void setRole(Role role) {
		this.role = role;
	}


	public void setfName(String fName) {
		this.fName = fName;
	}


	public void setlName(String lName) {
		this.lName = lName;
	}


	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}
	

	public String getStudentId() {
		return studentId;
	}


	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public void setVerification(String verification) {
		this.verification = verification;
	}
	
	public void setAccountVerified(Boolean isVerified){
		this.accountVerified = isVerified;
	}

	public static User getUser(Long userId) {
	    Session session = null;
	    try{
	      session = getSession();
	      Criteria criteria = session.createCriteria(User.class);
	      return (User) criteria.add(Restrictions.eq("userId", userId)).uniqueResult();
	    } finally {
	      session.close();
	    }
	}
	
	public static User getUser(String email) {
	    Session session = null;
	    try{
	      session = getSession();
	      Criteria criteria = session.createCriteria(User.class);
	      return (User) criteria.add(Restrictions.eq("email", email)).uniqueResult();
	    } finally {
	      session.close();
	    }
	}
	
	/**
	 * Create a new user record in the Database. Call the update() method instead if the user already exists.
	 * NOTE: The user's ID will be set by the DB after this returns.
	 */
	public User save(){
		HibernateUtil.save(this);
		return this;
	}

	/**
	 * Update an existing user record in the Database. Call the save() method instead if the user is new.
	 * NOTE: Do not modify the User's ID at any point before or after.
	 */
	public User update(){
		HibernateUtil.performAction(DBAction.UPDATE, this);
		return this;
	}
	
	/**
	 * Delete the user's record from the database.
	 */
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
