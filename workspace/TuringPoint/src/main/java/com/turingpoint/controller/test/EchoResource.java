package com.turingpoint.controller.test;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

import com.turingpoint.dbmodel.db.mapping.Student;
import com.turingpoint.dbmodel.db.mapping.User;
import com.turingpoint.dbmodel.db.persister.StudentPersister;
 
@Path("/test/")
public class EchoResource {
 
	@GET
	@Path("echo/{param}")
	public Response getMsg(@PathParam("param") String msg) 
	{
 
		String output = "Path was : " + msg;
 
		return Response.status(200).entity(output).build();
 
	}
	
	@GET
	@Path("serv/{param}")
	public Response getTest(@PathParam("param") Long courseId) 
	{
		List<Object[]> list = StudentPersister.getCourseStudents(courseId);
		int x = 5;
		return Response.status(200).entity("got the thing").build();
 
	}
 
}
