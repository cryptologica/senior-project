package com.turingpoint.controller;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

public class ServerTypes {
	// Making a fake mini database for doing canned replies for now
	// public static User fakeUserBank;
	// public static Course fakeCourseBank;
	// public static Lecture fakeLectureBank;
	// public static Question fakeQuestionBank;
	// public static Response fakeResponseBank;

	public static String TURINGPOINTSUPPORT_EMAIL = "turingpointteam@gmail.com";
	public static String INVALID_LOGIN = "Bad Username/Password";

	public static final Map<Integer, User> FAKE_USERS;
	static {
		User fakeUserBank = new User();
		Map<Integer, User> aMap = new HashMap<Integer, User>();
		try {
			aMap.put(1111, fakeUserBank.getFakeStudent1().clone());
			aMap.put(1112, fakeUserBank.getFakeStudent2().clone());
			aMap.put(1, fakeUserBank.getFakeInstructor1().clone());
		} catch (CloneNotSupportedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		FAKE_USERS = Collections.unmodifiableMap(aMap);
	}

	public static final Map<Integer, Course> FAKE_COURSES;
	static {
		Course fakeCourseBank = new Course();
		Map<Integer, Course> aMap = new HashMap<Integer, Course>();
		try {
		aMap.put(1234, fakeCourseBank.getFakeCourse1().clone());
		aMap.put(5678, fakeCourseBank.getFakeCourse2().clone());
		} catch (CloneNotSupportedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		FAKE_COURSES = Collections.unmodifiableMap(aMap);
	}

	public static final Map<Integer, Lecture> FAKE_LECTURES;
	static {
		Lecture fakeLectureBank = new Lecture();
		Map<Integer, Lecture> aMap = new HashMap<Integer, Lecture>();
		try {
		aMap.put(9807, fakeLectureBank.getFakeLecture1().clone());
		aMap.put(9400, fakeLectureBank.getFakeLecture2().clone());
		} catch (CloneNotSupportedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		FAKE_LECTURES = Collections.unmodifiableMap(aMap);
	}

	public static final Map<Integer, Question> FAKE_QUESTIONS;
	static {
		Question fakeQuestionBank = new Question();
		Map<Integer, Question> aMap = new HashMap<Integer, Question>();
		try {
		aMap.put(10, fakeQuestionBank.getFakeQuestion1().clone());
		aMap.put(50, fakeQuestionBank.getFakeQuestion2().clone());
		} catch (CloneNotSupportedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		FAKE_QUESTIONS = Collections.unmodifiableMap(aMap);
	}

	public static final Map<Integer, Response> FAKE_RESPONSES;
	static {
		Response fakeResponseBank = new Response();
		Map<Integer, Response> aMap = new HashMap<Integer, Response>();
		try {
		aMap.put(0, fakeResponseBank.getFakeResponse1().clone());
		aMap.put(1, fakeResponseBank.getFakeResponse2().clone());
		aMap.put(2, fakeResponseBank.getFakeResponse3().clone());
		aMap.put(3, fakeResponseBank.getFakeResponse4().clone());
		aMap.put(4, fakeResponseBank.getFakeResponse5().clone());
		aMap.put(5, fakeResponseBank.getFakeResponse6().clone());
		} catch (CloneNotSupportedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		FAKE_RESPONSES = Collections.unmodifiableMap(aMap);
	}

	public static class User implements Cloneable {
		public String firstName;
		public String lastName;
		public String password;
		public int role;
		public int userID;
		public String email;
		public int[] connectedCourses;

		public User getFakeStudent1() {
			firstName = "Tony";
			lastName = "Stark";
			password = "kaboom";
			role = 0;
			userID = 1111;
			email = "Tony.Stark@Shield.net";
			connectedCourses = new int[] { 1234, 5678 };
			return this;
		}

		public User getFakeStudent2() {
			firstName = "Steven";
			lastName = "Rogers";
			password = "murica";
			role = 0;
			userID = 1112;
			email = "Murica@Shield.net";
			connectedCourses = new int[] { 5678 };
			return this;
		}

		public User getFakeInstructor1() {

			firstName = "Winston";
			lastName = "Churchill";
			password = "brits";
			role = 1;
			userID = 1;
			email = "Kick.Ass.Brit@Parliment.co.uk";
			connectedCourses = new int[] { 1234, 5678 };
			return this;
		}

		@Override
		public User clone() throws CloneNotSupportedException {
			return (User) super.clone();
		}
	}

	public static class Course implements Cloneable {
		public int courseID;
		public String courseName;
		public String courseDescription;

		public Course getFakeCourse1() {
			courseID = 1234;
			courseName = "How to win at ASMR";
			courseDescription = "You want to be a winner dont you?";
			return this;
		}

		public Course getFakeCourse2() {
			courseID = 5678;
			courseName = "Badass Speaches and You";
			courseDescription = "Motivate anyone from soldiers to populist dross!";

			return this;
		}

		@Override
		public Course clone() throws CloneNotSupportedException {
			return (Course) super.clone();
		}
	}

	public static class Lecture implements Cloneable {
		public int lectureID;
		public int attachedToCourse;
		public String lectureName;
		public int[] attachedQuestions;
		public String startDate;
		public String endDate;

		public Lecture getFakeLecture1() {
			lectureID = 9807;
			attachedToCourse = 1234;
			lectureName = "Your First ASMR Experiences";
			attachedQuestions = new int[] { 10 };
			startDate = "10/10/2010";
			endDate = "10/10/2010";
			return this;
		}

		public Lecture getFakeLecture2() {
			lectureID = 9400;
			attachedToCourse = 1234;
			lectureName = "The pen is a sword by itself";
			attachedQuestions = new int[] { 50 };
			startDate = "10/10/2010";
			endDate = "10/10/2010";

			return this;
		}

		@Override
		public Lecture clone() throws CloneNotSupportedException {
			return (Lecture) super.clone();
		}
	}

	public static class Question implements Cloneable {
		public int questionID;
		public int questionType;
		public int questionGroupID;
		public String questionTitle;
		public String questionContent;
		public String feedback;
		public int pointValue;
		public int[] answerOptions;

		public Question getFakeQuestion1() {
			questionID = 10;
			questionType = 0; // multi choice
			questionGroupID = -1; // no group
			questionTitle = "Intro 1";
			questionContent = "Do you know what ASMR is?";
			feedback = "Most people do not know what ASMR is, here is what google says: https://www.google.com/search?q=what+is+asmr&ie=utf-8&oe=utf-8";
			pointValue = 0;
			answerOptions = new int[] { 0, 1 };

			return this;
		}

		public Question getFakeQuestion2() {
			questionID = 50;
			questionType = 0; // multi choice
			questionGroupID = -1; // no group
			questionTitle = "Intro 1";
			questionContent = "What is the word that fills in this blank? The pen is ______ than the sword";
			feedback = "This is a very old phrase, look at https://en.wikipedia.org/wiki/The_pen_is_mightier_than_the_sword";
			pointValue = 0;
			answerOptions = new int[] { 2, 3, 4, 5 };

			return this;
		}

		@Override
		public Question clone() throws CloneNotSupportedException {
			return (Question) super.clone();
		}
	}

	public static class Response implements Cloneable {
		public int responseID;
		public String responseText;

		public Response getFakeResponse1() {
			responseID = 0;
			responseText = "Yes I do";
			return this;
		}

		public Response getFakeResponse2() {
			responseID = 1;
			responseText = "No I don't";
			return this;
		}

		public Response getFakeResponse3() {
			responseID = 2;
			responseText = "mightier";
			return this;
		}

		public Response getFakeResponse4() {
			responseID = 3;
			responseText = "lighter";
			return this;
		}

		public Response getFakeResponse5() {
			responseID = 4;
			responseText = "thinner";
			return this;
		}

		public Response getFakeResponse6() {
			responseID = 5;
			responseText = "fancier";
			return this;
		}

		@Override
		public Response clone() throws CloneNotSupportedException {
			return (Response) super.clone();
		}
	}
	
	public static JSONObject StringToJSON(InputStream jsonStream)
    {
    	String jsonMessage = "";
		StringBuilder worldMaker = new StringBuilder();
		try 
		{
			BufferedReader in = new BufferedReader(new InputStreamReader(jsonStream));
			String line = null;
			while ((line = in.readLine()) != null) 
			{
				worldMaker.append(line);
			}
			jsonMessage = worldMaker.toString();
		} 
		catch (Exception e) 
		{
			jsonMessage = "{}";
		}

		return new JSONObject(jsonMessage);
    }
	
	public static String StreamToString(InputStream jsonStream)
    {
    	String jsonMessage = "";
		StringBuilder worldMaker = new StringBuilder();
		try 
		{
			BufferedReader in = new BufferedReader(new InputStreamReader(jsonStream));
			int character;
			while ((character = in.read()) != -1) 
			{
				worldMaker.append((char)character);
			}
			jsonMessage = worldMaker.toString();
		} 
		catch (Exception e) 
		{
			jsonMessage = "{}";
		}

		return jsonMessage;
    }
	
	/**
	* HtmlEscape in Java, which is compatible with utf-8
	* @author Ulrich Jensen, http://www.htmlescape.net
	* Feel free to get inspired, use or steal this code and use it in your
	* own projects.
	* License:
	* You have the right to use this code in your own project or publish it
	* on your own website.
	* If you are going to use this code, please include the author lines.
	* Use this code at your own risk. The author does not warrent or assume any
	* legal liability or responsibility for the accuracy, completeness or usefullness of
	* this program code.
	*/ 
	private static char[] hex={'0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'};

	  /**
	   * Method for html escaping a String, for use in a textarea
	   * @param original The String to escape
	   * @return The escaped String
	   */
	  public static String HTMLescapeTextArea(String original)
	  {
	    return escapeSpecial(escapeTags(original));    
	  }
	  
	  /**
	   * Normal escape function, for Html escaping Strings
	   * @param original The original String
	   * @return The escape String
	   */
	  public static String HTMLescape(String original)
	  {
	    return escapeSpecial(escapeBr(escapeTags(original)));
	  }
	  
	  public static String escapeTags(String original)
	  {
	    if(original==null) return "";
	    StringBuffer out=new StringBuffer("");
	    char[] chars=original.toCharArray();
	    for(int i=0;i<chars.length;i++)
	    {
	      boolean found=true;
	      switch(chars[i])
	      {
	        case 60:out.append("&lt;"); break; //<
	        case 62:out.append("&gt;"); break; //>
	        case 34:out.append("&quot;"); break; //"
	        default:found=false;break;
	      }
	      if(!found) out.append(chars[i]);
	      
	    }
	    return out.toString();
	    
	  }

	  public static String escapeBr(String original)
	  {
	    if(original==null) return "";
	    StringBuffer out=new StringBuffer("");
	    char[] chars=original.toCharArray();
	    for(int i=0;i<chars.length;i++)
	    {
	      boolean found=true;
	      switch(chars[i])
	      {
	        case '\n': out.append("<br/>"); break; //newline
	        case '\r': break;
	        default:found=false;break;
	      }
	      if(!found) out.append(chars[i]);
	      
	    }
	    return out.toString();
	  }
	  
	  public static String escapeSpecial(String original)
	  {
	    if(original==null) return "";
	    StringBuffer out=new StringBuffer("");
	    char[] chars=original.toCharArray();
	    for(int i=0;i<chars.length;i++)
	    {
	        boolean found=true;
	      switch(chars[i]) {
	        case 38:out.append("&amp;"); break; //&
	        case 198:out.append("&AElig;"); break; //Æ
	        case 193:out.append("&Aacute;"); break; //Á
	        case 194:out.append("&Acirc;"); break; //Â
	        case 192:out.append("&Agrave;"); break; //À
	        case 197:out.append("&Aring;"); break; //Å
	        case 195:out.append("&Atilde;"); break; //Ã
	        case 196:out.append("&Auml;"); break; //Ä
	        case 199:out.append("&Ccedil;"); break; //Ç
	        case 208:out.append("&ETH;"); break; //Ð
	        case 201:out.append("&Eacute;"); break; //É
	        case 202:out.append("&Ecirc;"); break; //Ê
	        case 200:out.append("&Egrave;"); break; //È
	        case 203:out.append("&Euml;"); break; //Ë
	        case 205:out.append("&Iacute;"); break; //Í
	        case 206:out.append("&Icirc;"); break; //Î
	        case 204:out.append("&Igrave;"); break; //Ì
	        case 207:out.append("&Iuml;"); break; //Ï
	        case 209:out.append("&Ntilde;"); break; //Ñ
	        case 211:out.append("&Oacute;"); break; //Ó
	        case 212:out.append("&Ocirc;"); break; //Ô
	        case 210:out.append("&Ograve;"); break; //Ò
	        case 216:out.append("&Oslash;"); break; //Ø
	        case 213:out.append("&Otilde;"); break; //Õ
	        case 214:out.append("&Ouml;"); break; //Ö
	        case 222:out.append("&THORN;"); break; //Þ
	        case 218:out.append("&Uacute;"); break; //Ú
	        case 219:out.append("&Ucirc;"); break; //Û
	        case 217:out.append("&Ugrave;"); break; //Ù
	        case 220:out.append("&Uuml;"); break; //Ü
	        case 221:out.append("&Yacute;"); break; //Ý
	        case 225:out.append("&aacute;"); break; //á
	        case 226:out.append("&acirc;"); break; //â
	        case 230:out.append("&aelig;"); break; //æ
	        case 224:out.append("&agrave;"); break; //à
	        case 229:out.append("&aring;"); break; //å
	        case 227:out.append("&atilde;"); break; //ã
	        case 228:out.append("&auml;"); break; //ä
	        case 231:out.append("&ccedil;"); break; //ç
	        case 233:out.append("&eacute;"); break; //é
	        case 234:out.append("&ecirc;"); break; //ê
	        case 232:out.append("&egrave;"); break; //è
	        case 240:out.append("&eth;"); break; //ð
	        case 235:out.append("&euml;"); break; //ë
	        case 237:out.append("&iacute;"); break; //í
	        case 238:out.append("&icirc;"); break; //î
	        case 236:out.append("&igrave;"); break; //ì
	        case 239:out.append("&iuml;"); break; //ï
	        case 241:out.append("&ntilde;"); break; //ñ
	        case 243:out.append("&oacute;"); break; //ó
	        case 244:out.append("&ocirc;"); break; //ô
	        case 242:out.append("&ograve;"); break; //ò
	        case 248:out.append("&oslash;"); break; //ø
	        case 245:out.append("&otilde;"); break; //õ
	        case 246:out.append("&ouml;"); break; //ö
	        case 223:out.append("&szlig;"); break; //ß
	        case 254:out.append("&thorn;"); break; //þ
	        case 250:out.append("&uacute;"); break; //ú
	        case 251:out.append("&ucirc;"); break; //û
	        case 249:out.append("&ugrave;"); break; //ù
	        case 252:out.append("&uuml;"); break; //ü
	        case 253:out.append("&yacute;"); break; //ý
	        case 255:out.append("&yuml;"); break; //ÿ
	        case 162:out.append("&cent;"); break; //¢
	        default:
	          found=false;
	          break;
	      }
	      if(!found)
	      {
	        if(chars[i]>127) {
	          char c=chars[i];
	          int a4=c%16;
	          c=(char) (c/16);
	          int a3=c%16;
	          c=(char) (c/16);
	          int a2=c%16;
	          c=(char) (c/16);
	          int a1=c%16;
	          out.append("&#x"+hex[a1]+hex[a2]+hex[a3]+hex[a4]+";");    
	        }
	        else
	        {
	          out.append(chars[i]);
	        }
	      }
	    }  
	    return out.toString();
	  } 

}
