package com.turingpoint.authentication;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;

import javax.annotation.security.DenyAll;
import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import org.glassfish.jersey.internal.util.Base64;
import org.json.JSONObject;

import com.turingpoint.dbmodel.db.dto.Credentials;
import com.turingpoint.dbmodel.db.mapping.User;
import com.turingpoint.dbmodel.db.persister.UserPersister;
import com.turingpoint.dbmodel.model.Role;

/**
 * This filter verify the access permissions for a user based on username and
 * passowrd provided in request
 */
@Provider
public class AuthenticationFilter implements javax.ws.rs.container.ContainerRequestFilter {

	private static HashMap<String, Credentials> credentials = new HashMap<String, Credentials>();

	@Context
	private ResourceInfo resourceInfo;

	private static final String AUTHORIZATION_PROPERTY = "Authorization";
	private static final String AUTHENTICATION_SCHEME = "Basic";

	@Override
	public void filter(ContainerRequestContext requestContext) {
		Method method = resourceInfo.getResourceMethod();
		// Access allowed for all
		if (!method.isAnnotationPresent(PermitAll.class)) {
			// Access denied for all
			if (method.isAnnotationPresent(DenyAll.class)) {
				requestContext.abortWith(forbiddenResponse());
				return;
			}

			// Get request headers
			final MultivaluedMap<String, String> headers = requestContext.getHeaders();

			// Fetch authorization header
			final List<String> authorization = headers.get(AUTHORIZATION_PROPERTY);

			// If no authorization information present; block access
			if (authorization == null || authorization.isEmpty()) {
				requestContext.abortWith(unauthorizedResponse());
				return;
			}

			// Get encoded username and password
			final String encodedUserPassword = authorization.get(0).replaceFirst(AUTHENTICATION_SCHEME + " ", "");

			// Decode username and password
			String usernameAndPassword = new String(Base64.decode(encodedUserPassword.getBytes()));

			// Split username and password tokens
			final StringTokenizer tokenizer = new StringTokenizer(usernameAndPassword, ":");
			final String username = tokenizer.nextToken();
			final String password = tokenizer.nextToken();

			// Verifying Username and password
			System.out.println(username);
			System.out.println(password);

			// Verify user access
			if (method.isAnnotationPresent(RolesAllowed.class)) {
				RolesAllowed rolesAnnotation = method.getAnnotation(RolesAllowed.class);
				Set<String> rolesSet = new HashSet<String>(Arrays.asList(rolesAnnotation.value()));

				// Is user valid?
				checkIfUserAllowed(requestContext, username, password, rolesSet);
			}
		}
	}

	private void checkIfUserAllowed(ContainerRequestContext requestContext, final String username, final String password, final Set<String> rolesSet) {
		boolean isAllowed = false;

		// Step 1. Fetch password from database and match with password in
		// argument
		// If both match then get the defined role for user from database and
		// continue; else return isAllowed [false]
		// Access the database and do this part yourself
		// String userRole = userMgr.getUserRole(username);

		Credentials credential = null;
		if (credentials.containsKey(username)) {
			System.out.println("User in storage!");
			credential = credentials.get(username);
		} else {
			credential = UserPersister.login(username);
			// If user exists and passwords match
			if (credential != null && password.equals(credential.getPassword())) {
				System.out.println("New user login!");
				credentials.put(username, credential);
			} else{	// User doesnt' exits, or passwords don't match
				requestContext.abortWith(unauthorizedResponse());
				return;
			}
		}
		
		if (!credential.getAccountVerified()){	// Check if account not verified
			requestContext.abortWith(unverifiedAccountResponse(username, credential.getUserId()));
			return;
		}

		// Verify user role
		String role = credential.getRole().name();
		if (rolesSet.contains(role)) {
			isAllowed = true;
		}

		if (!isAllowed){
			requestContext.abortWith(unauthorizedResponse());
		}
	}

	/**
	 * Update the email address of a user (only applied to this local credential manager)
	 */
	public static void updateUsersEmail(String oldEmail, String newEmail){
		Credentials creds = credentials.get(oldEmail);
		credentials.remove(oldEmail);
		credentials.put(newEmail, creds);
	}
	
	/**
	 * Add a new user to the underlying credential storage
	 */
	public static void addNewUserToCachedCredentials(Long userId, String password, Role role, String email){
		Credentials creds = new Credentials();
		creds.setAccountVerified(false);
		creds.setUserId(userId);
		creds.setPassword(password);
		creds.setRole(role);
		credentials.put(email, creds);
	}
	
	/**
	 * Set the local cache's user account to verified. Only call once this has been updated in the DB.
	 */
	public static void verifyAccount(String emailAddress){
		credentials.get(emailAddress).setAccountVerified(true);
	}

	public static Credentials getUser(HttpHeaders headers) {
		String s = headers.getRequestHeaders().getFirst("authorization");

		// Get encoded username and password
		final String encodedUserPassword = s.replaceFirst("Basic ", "");

		// Decode username and password
		String usernameAndPassword = new String(Base64.decode(encodedUserPassword.getBytes()));
		;

		// Split username and password tokens
		final StringTokenizer tokenizer = new StringTokenizer(usernameAndPassword, ":");
		final String username = tokenizer.nextToken();
		final String password = tokenizer.nextToken();

		// System.out.println(username);
		// System.out.println(password);

		return getRole(username); // If stored credentials found will return it,
									// else return null (user's credentials
									// don't exist)
	}

	public static Credentials getRole(String emailAddress) {
		if (credentials.containsKey(emailAddress))
			return credentials.get(emailAddress);
		return null;
	}

	private Response unauthorizedResponse() {
		return Response.status(Response.Status.UNAUTHORIZED).entity("You cannot access this resource").build();
	}

	private Response unverifiedAccountResponse(String email, Long userId) {
		JSONObject responseObject = new JSONObject();
		responseObject.put("msg", "This account has not been verified. Check your inbox for your verificaiton email, or <a id=\"verifyUpdateButton\" data-toggle=\"modal\" data-target=\"#confirmModal\">Re-send/Update Verification Email</a>.");
		responseObject.put("email", email);
		responseObject.put("userId", userId);
		return Response.status(Response.Status.UNAUTHORIZED).entity(responseObject.toString()).build();
	}

	private Response forbiddenResponse() {
		return Response.status(Response.Status.FORBIDDEN).entity("Access blocked for all users !!").build();
	}
}