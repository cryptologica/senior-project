package com.turingpoint.controller;

import javax.ws.rs.ApplicationPath;

import org.glassfish.jersey.filter.LoggingFilter;
import org.glassfish.jersey.server.ResourceConfig;

import com.turingpoint.authentication.AuthenticationFilter;
import com.turingpoint.controller.auth.LoginServices;

@ApplicationPath("/")
public class TuringPointServices extends ResourceConfig {

	// ,com.jersey.jaxb,com.fasterxml.jackson.jaxrs.json
	// Maybe add: ,com.jersey.jaxb,
	public TuringPointServices(){
		packages("com.turingpoint");
		register(LoggingFilter.class);
		register(AuthenticationFilter.class);
	}
}