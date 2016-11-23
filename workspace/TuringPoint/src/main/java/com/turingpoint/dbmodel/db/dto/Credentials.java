package com.turingpoint.dbmodel.db.dto;

import org.pojomatic.Pojomatic;
import org.pojomatic.annotations.AutoProperty;

import com.turingpoint.dbmodel.model.Role;

/**
 * A simple class to fetch user's credentials
 * @author scotthadley
 *
 */
@AutoProperty
public class Credentials {

	Long userId;
	String password;
	Role role;
	Boolean accountVerified;
	
	public Credentials(){};
	
	public Credentials(Long userId, String password, String role, Boolean accountVerified) {
		this.userId = userId;
		this.password = password;
		this.role = Role.valueOf(role);
		this.accountVerified = accountVerified;
	}

	public Role getRole(){
		return role;
	}
	
	public Long getUserId() {
		return userId;
	}

	public Boolean getAccountVerified(){
		return accountVerified;
	}

	public String getPassword() {
		return password;
	}

	public void setRole(Role role){
		this.role = role;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}


	public void setPassword(String password) {
		this.password = password;
	}
	
	public void setAccountVerified(Boolean accountVerified){
		this.accountVerified = accountVerified;
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
