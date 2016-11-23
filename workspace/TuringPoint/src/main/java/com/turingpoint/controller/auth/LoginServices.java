package com.turingpoint.controller.auth;

import java.io.InputStream;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import com.turingpoint.controller.ServerContext;
import com.turingpoint.controller.ServerTypes;
import com.turingpoint.dbmodel.db.dto.Credentials;
import com.turingpoint.dbmodel.db.dto.NewUser;
import com.turingpoint.dbmodel.db.mapping.User;
import com.turingpoint.dbmodel.db.persister.UserPersister;
import com.turingpoint.dbmodel.model.Role;

@Path("/login")
@Produces(MediaType.APPLICATION_JSON)
//TODO: Add exception handling for bad user logins to avoid error 500, need protection before line 40 so compare does not fail with null
public class LoginServices {

	ServerContext server = ServerContext.INSTANCE;
	
    @RolesAllowed({"INSTRUCTOR", "STUDENT"})
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response ProcessLoginRequest(InputStream inputJSON) 
    {
    	String msg = ""; 	
    	JSONObject responseObject = new JSONObject();

    	//Vars now in catch blocks must be declared outside the trys
    	String passedEmail;
    	String passedPass;
    	Credentials credentials;
    	User userGuy;
    	
    	//Validate input is json
    	JSONObject inputObject;
    	try
    	{
    		inputObject = ServerTypes.StringToJSON(inputJSON);
    	}
    	catch(Exception e)
    	{
    		//TODO: Log bad user id and stack trace
    		msg = "Malformed Request Packet";
    		System.out.println("LoginServices | 53 | Malformed JSON | " + ServerTypes.StreamToString(inputJSON));
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	//Validate the input object
    	try
    	{
    		passedEmail = inputObject.getString("email");
    		passedPass = inputObject.getString("password");
    	}
    	catch(Exception e)
    	{
    		msg = "Request lacks required parameters";
    		System.out.println("LoginServices | 69 | Paramater Missing JSON | " + inputObject.toString());
    		responseObject.put("msg",msg);
    		return Response.status(415).entity(responseObject.toString()).build();
    	}
    	
    	//Login
		try
		{
	    	credentials = UserPersister.login(passedEmail);
	    	
	    	if(credentials == null)	// If user doesn't exist
	    		return invalidLogin();
	    	
	    	userGuy = User.getUser(credentials.getUserId());

	    	// TODO: Ensure everything is valid, handle accordingly
	    	if(!passedPass.equals(credentials.getPassword()))
	    		return invalidLogin();
		}		
		catch(Exception e)
		{
			//TODO: Add code to log the malformed JSON and stack trace here
			msg = "Fatal Login Error";
			System.err.println("LoginServices | 94 | Fatal Login Error |" +e.getMessage());
			e.printStackTrace();
    		responseObject.put("msg",msg);
    		return Response.status(500).entity(responseObject.toString()).build();
		}
    	
    	responseObject.put("fname", userGuy.getfName());
    	responseObject.put("lname", userGuy.getlName());
    	responseObject.put("userId", credentials.getUserId());
    	responseObject.put("role", userGuy.getRole());
    	return Response.status(200).entity(responseObject.toString()).build();
    }
    
    @POST
    @Path("/forgot")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response CreateNewUser(InputStream inputJSON) {
    	
    	JSONObject responseObject = new JSONObject();
    	
    	String msg = "", email;
    	
    	// Validate input is json
    	JSONObject inputObject;
    	try
    	{
    		inputObject = ServerTypes.StringToJSON(inputJSON);
    	}
    	catch(Exception e)
    	{
    		//TODO: Log bad user id and stack trace
    		msg = "Malformed Request Packet "+ inputJSON.toString();
    		System.out.println("UserServices | 64 | Malformed JSON | " + ServerTypes.StreamToString(inputJSON));
    		responseObject.put("msg",msg);
    		return Response.status(400).entity(responseObject.toString()).build();
    	}
    	
    	// Validate input has required fields
    	try
    	{
    		email = ServerTypes.escapeTags(inputObject.getString("email"));

    	}
    	catch(Exception e)
    	{
    		msg = "Request lacks required parameters";
    		System.out.println("UserServices | 85 | Paramater Missing JSON | " + inputObject.toString());
    		responseObject.put("msg", msg);
    		return Response.status(400).entity(responseObject.toString()).build();
    	}
    	
    	try
    	{
    		User user = User.getUser(email);
    		SendEmail.sendEmail(user.getEmail(), "Password Request", "Your password is: " + user.getPassword());
    		System.out.println("Password request sent to user with email: " + email);
    	}
    	catch(NullPointerException e)
    	{
    		//TODO: Log why user could not be created, log stack trace and json
    		msg = "Email address not found.";
    		responseObject.put("msg", msg);
    		return Response.status(400).entity(responseObject.toString()).build();
    	}
    	catch(Exception e)
    	{
    		//TODO: Log why user could not be created, log stack trace and json
    		msg = "Could Not Retrieve Email/Password";
    		responseObject.put("msg", msg);
    		return Response.status(500).entity(responseObject.toString()).build();
    	}

    	responseObject.put("msg", "Sent Email");
    	
    	return Response.status(200).entity(responseObject.toString()).build();
    	
    }
    
    private Response invalidLogin(){
    	JSONObject responseObject = new JSONObject();
		String msg = "Invalid Email/Password";
		responseObject.put("msg",msg);
		return Response.status(400).entity(responseObject.toString()).build();
    }
}

