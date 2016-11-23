package com.turingpoint;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.turingpoint.controller.ServerContext;

@Path("myresource")
public class MyResource {

	ServerContext server = ServerContext.INSTANCE;
	
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getIt() 
    {
    	if(server != null) {
    		
    		String violin = server.getContextTestMessage();
    	
    		return violin;
    	}
    	else
    		return "Dont got it";
    }
}
