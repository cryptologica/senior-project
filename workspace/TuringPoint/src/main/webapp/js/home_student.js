

//global variables

//default url
var baseURL;
var timeout;

// function to start when the page is loaded
$(document).ready(initialize());

/**
 * Main function to be run when page is opened
 * @param page : current page
 */
function initialize()
{
	
	baseURL = sessionStorage.getItem("baseURL");
	sessionStorage.removeItem("lastUpdateHome");
	var userid = sessionStorage.getItem('userID');
	sessionStorage.setItem("currQID", null);
	$.ajaxSetup({
	    cache: false
	});
	 $.ajax({
		    method : 'GET',
		    ContentType: 'application/json',
		    url : baseURL +"/users/" + userid + "/courses",
		    success: setClass
		    });
	 
};

//callback for initializing a on the page
//If no course exist -> go to add course page, else set first course as default course
function setClass(result, error)
{
	
	
	if(error == "success")
	{
		
		$("#quizzes").empty();

		var courses = result.Courses;
		var classHTML = "";
		if(courses.length == 0)
		{
			loadPage("addClass_student");
		}
		else
		{
			var courseDropdown =
				  '<div style="margin-top: 15px;" class="row">'+
				    '<div class="col-md-1">'+
				      '<p class="lead text-left">Course:</p>'+
				    '</div>'+
				    '<div class="col-md-3">'+
				    '	<select class="form-control" id="courseSelect" style="margin:5px">';
			
			// Add course to list of courses on homepage
			for (var i = 0; i < courses.length; i++) {
				var courseID = courses[i].courseId;
				var courseName = courses[i].name;
				var description = courses[i].description;
				courseDropdown += '<option id = "class" description = "'+description+'" courseId="' + courseID + '" courseName="' + courseName + '">' + courseName + '</option>';
			}
			courseDropdown +=
				'</select>'+
				'</div>'+
				'<div class="col-md-3">'+
			    	' <button type="button" id="addCourse" class="btn btn-primary" style="float: left; margin:5px">Add Course</button>'+
			  	'</div>'+	
				'</div>'+
			  	'<div id="courseContent"></div>';
			
			$("#courses").append(courseDropdown);
			
			var courseID = sessionStorage.getItem('courseID');
			
			if(courseID != null){
				$('[courseid="' + courseID + '"]').prop('selected', true);	// Set as selected course
			}
			
			//set up homepage to corresponding class
			courseID = sessionStorage.getItem("courseID");
			if(courseID == "undefined" || courseID == null)
			{
				//save courseID
				courseID = courses[0].courseId;
				sessionStorage.setItem("courseID", courseID);
				
				//save data for refresh of page
				var courseName = courses[0].name;
				sessionStorage.setItem("courseName", courseName);
				var description = courses[0].description;
				sessionStorage.setItem("description",description);
				
				//set title of class
				$("#className").append(courseName);
				$("#description").append("<small>"+description+"</small>");
			}
			else
			{
				var courseName = sessionStorage.getItem("courseName");
				var description = sessionStorage.getItem("description");
				
				//set title of class
				$("#className").append(courseName);
				$("#description").append("<small>"+description+"</small>");
			}
			
			
			//method to get rest of data
			quizAvail(courseID);
		}
	}
	else
	{
		$('div[id="formError"]').html( generateAlert("Failed to get courses", 4) );
	}
};

/**
 * get the status of available questions for the course 
 */
function quizAvail(courseID)
{	
	sessionStorage.setItem('courseID', courseID);
	$.ajax({
		    method : 'GET',
		    ContentType: 'application/json', 
		    url : baseURL +"/courses/" + courseID + "/status",
		    success: quizAvailCallback,
		    error: quizAvailCallback
		    });

	
};

/**
 * Check if there is any active questions
 * and display the questions on the page and make
 * it possible to go to quiz page
 */
function quizAvailCallback(results, error)
{
	if(error == "success")
	{
		sessionStorage.setItem("lastUpdateHome", results.lastUpdate);
		var quizBool = false;
		if(results.QS.length > 0)
		{
			$('#quizzes').empty();
			quizBool = true;
			document.getElementById("bell").style.color = "green";
			for(var i = 0; i < results.QS.length; i++)
				{
					var HTML = '<a href="#" id="qLinks" qid = "'+results.QS[i].questionId+'"><div class = "list-group-item">'+results.QS[i].title+'</div></a>';
					$("#quizzes").append(HTML);
				}
		}
		else
		{
			quizBool = false;
			document.getElementById("bell").style.color = "red";
			document.getElementById("quizzes").innerHTML = '<div class = "list-group-item">There is no active questions.</div>';
		}
	}
	else
	{
		$('div[id="formError"]').html( generateAlert("Question set cannot be found", 4) );
	}
	lectureAvail();
};

/**
 * Get the available lectures for review
 */
function lectureAvail()
{
	var courseID = sessionStorage.getItem('courseID');
	$.ajax({
	    method : 'GET',
	    ContentType: 'application/json', 
	    url : baseURL +"/courses/" + courseID + "/lectures",
	    success: getLecture,
	    error: getLecture
	   });
};

/**
 * Find the most recent lecture
 */
function getLecture(result, error)
{
	if(error == "success")
		{
			$("#lectureDate").empty();
			$("#lectureTitle").empty();
			$("#lectureQuestions").empty();
			$("#load").removeClass("hidden");
			
			//There is no lectures created for the course
			if(result.Lectures.length <= 0)
				{
					//$("#lectureDate").append("");
					$("#load").addClass("hidden");
					$("#lectureTitle").append("No lectures for this course are available.");
					//$("#lectureQuestions").append();
				}
			else
				{
					var lecture = result.Lectures[0];
					for(var i = 1; i < result.Lectures.length; i++)
						{
							if(Date.parse(lecture.publishDate) < Date.parse(result.Lectures[i].publishDate))
								{
									lecture = result.Lectures[i];
								}
						}
					$("#lectureDate").append(lecture.publishDate);
					$("#lectureTitle").append(lecture.name);
					var lectureID = lecture.lectureId;
					sessionStorage.setItem("lectureID", lectureID);
					sessionStorage.setItem("lectureTitle", lecture.name);
					var url = baseURL + "/results/" + lectureID +"/lecture";
					
					//get lecture questions
					$.ajax({
					    method : 'GET',
					    ContentType: 'application/json', 
					    url : url,
					    success: getLectureQuestion,
					    error: getLectureQuestion
					    })
				}
		}
	else
		{
			$('div[id="formError"]').html( generateAlert("lecture cannot be found", 4) );
		}
};

/**
 * Get and display all published questions for most recent lecture
 */
function getLectureQuestion(results, error)
{
	if(error == "success")
	{
		var publishExist = false;
		if(results.lectureResults.length > 0)
		{
			$('#lectureQuestions').empty();
			$("#load").addClass("hidden");
			for(var i = 0; i < results.lectureResults.length; i++)
				{
						if(results.lectureResults[i].published)
							{
								var publishExist = true;
								var score = 0;
								for(var j = 0; j < results.lectureResults[i].results.length; j++)
									{
										for(var k = 0; k < results.lectureResults[i].results[j].users.length; k++)
											{
												score = results.lectureResults[i].results[j].users[k].points;
											}
									}
								var HTML = '<a href="#" id="lLinks" qid = "'+results.lectureResults[i].qID+'"><div class = "list-group-item">'+results.lectureResults[i].title+'<div style="float:right">Score : '+score+'/'+results.lectureResults[i].value+'</div></div></a>';
								$("#lectureQuestions").append(HTML);
							}					
				}
			
			//there is no published questions
			if(!publishExist)
				{
				var HTML = '<div class = "list-group-item">No question results for this lecture are currently available.</div>';
				$("#lectureQuestions").append(HTML);
				}
		}
		else
		{
			$("#load").addClass("hidden");
			document.getElementById("lectureQuestions").innerHTML = '<div class = "list-group-item">There is no "published" questions available for this lecture.</div>';
		}
		timeout = setTimeout(checkUpdate, 20000);
	}
	else
	{
		$('div[id="formError"]').html( generateAlert("Lecture questions cannot be found", 4) );
	}
};

/**
 * The function that is called when the page is checking for any updates to active questions
 */
function checkUpdate()
{
	var courseID = sessionStorage.getItem("courseID");
	$('div[id="formError"]').empty();
	$.ajax({
	    method : 'GET',
	    ContentType: 'application/json', 
	    url : baseURL +"/courses/" + courseID + "/status",
	    success: function(result,error)
	    {
	    	var updateTime = sessionStorage.getItem("lastUpdateHome");
	    	if(result.lastUpdate != updateTime)
	    		{
	    			$('div[id="formError"]').html( generateAlert("<strong>The list of active questions has been updated</strong>.", 3) );
	    			quizAvailCallback(result,error);
	    		}
	    	else
	    		{
	    			timeout = setTimeout(checkUpdate, 20000);
	    		}
	    },
	    error: function(result,error)
	    {
	    	console.log("error in updating");
	    }
	    });
};

//Click event for the question links
$(document).on('click', '#qLinks', function(event)
{
	event.preventDefault();
	var qid = $(this).attr("qid");
	sessionStorage.setItem("currQID", JSON.stringify(qid));
	loadPage("quiz_student");
});

//Click event for the question links
$(document).on('click', '#lLinks', function(event)
{
	event.preventDefault();
	var qid = $(this).attr("qid");
	sessionStorage.setItem("currQID", JSON.stringify(qid));
	loadPage("result_student");
});


//event handler for switching to another class
$(document).on('change', '#courseSelect', function(event)
{
	event.preventDefault();
	
	$('div[id="formError"]').empty();
	var name = $('#courseSelect option:selected').attr('courseName');
	var id = $('#courseSelect option:selected').attr('courseId');
	var description = $('#courseSelect option:selected').attr('description');
	sessionStorage.setItem("courseID", id);
	sessionStorage.setItem("courseName", name);
	sessionStorage.setItem("description",description);
	

	$("#className").empty();
	$("#description").empty();
	$("#className").append(name);
	$("#description").append("<small>"+description+"</small>");
	
	//clear the timeout :: prevents multiple time events from occuring
	clearTimeout(timeout);
	quizAvail(id);
});

//event handler for switching to another class
$(document).on('click', '#addCourse', function(event)
{
	event.preventDefault();
	loadPage("addClass_student");
});

//Click event for the review button
$(document).on('click', '#review', function(event)
{
	event.preventDefault();
	loadPage("review_student");
});



//Click event for the quiz button
$(document).on('click', '#takeQuiz', function(event)
{
	event.preventDefault();
	var courseID = sessionStorage.getItem("courseID");
	$.ajax({
	    method : 'GET',
	    ContentType: 'application/json', 
	    url : baseURL +"/courses/" + courseID + "/status",
	    success: takeQuizCallback,
	    error: takeQuizCallback
	    });
});

/**
 * checks if there is any active questions before
 * proceeding to quiz page.
 */
function takeQuizCallback(results, error)
{
	if(error = "success")
	{
		$("#quizzes").empty();
		if(results.QS.length > 0)
		{
			document.getElementById("bell").style.color = "green";
			for(var i = 0; i < results.QS.length; i++)
				{
					var HTML = '<div class = "list-group-item">'+results.QS[i].title+'</div>';
					$("#quizzes").append(HTML);
				}
			loadPage("quiz_student");
		}
		else
		{
			document.getElementById("bell").style.color = "red";
			document.getElementById("quizzes").innerHTML = '<div class = "list-group-item">N/A</div>';
			$('div[id="formError"]').html( generateAlert("There are no questions available.", 2) );
		}
	}
	else
	{
		$('div[id="formError"]').html( generateAlert("Question set cannot be found", 4) );
	}
};
