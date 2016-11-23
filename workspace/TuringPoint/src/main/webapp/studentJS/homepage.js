
var allCourses = [];
var userid = "";
var addChoice = "";
var url = "http://localhost:8080/TuringPoint/rest/";
var myCourse = [];
var currentPage = "";

/**
 * Main function to be run when page is opened
 * @param page : current page
 */
function initialize(page)
{
	url = sessionStorage.getItem("baseURL") + "/";
	userid = parseInt(sessionStorage.getItem("userID"));
	currentPage = page;
	 $.ajax({
		    method : 'GET',
		    ContentType: 'application/json', 
		    url : url +"users/" + userid + "/courses",
		    success: addClass
		    });
	 
		$("#dialog").dialog({
	autoOpen : false,
	height: 300,
	width: 350,
	modal: true,
	buttons: {
		"Add" : addCourse,
		Cancel : function(){
			$("#dialog").dialog("close");
		}
	}
});
};

//button event handlers

//In dialog, when class is clicked, get that class' description
$(document).on('click', '#options', function(event) {
	event.preventDefault();
	document.getElementById("description").innerHTML = allCourses[event.currentTarget.value].description;
	addChoice = event.currentTarget.value;
});

//Take quiz button was clicked, go to takeQuiz page for that course
$(document).on('click', '#quiz', function(event) {
	event.preventDefault();
	
	sessionStorage.setItem("courseID", event.currentTarget.value);
	loadQuestionsAndPage(3, "takeQuiz");	// Method that loads the active questions and contents of the page
});

//open dialog to add class
$(document).on('click', '#add', function(event) {
	event.preventDefault();
	$.ajax({
	    method : 'GET',
	    ContentType: 'application/json', 
	    url : url +"courses",
	    success: refreshClassList
	    });
});

//callback for when 'add class' button is clicked
//If success, get all classes from database and display them on dialog
function refreshClassList(result, error)
{
	if(error == "success")
	{
		allCourses = result.Courses;
		for(var i = 0; i < allCourses.length;i++)
		{
			var HTML = '<option value = "' + i+'">'+ allCourses[i].name+ '</option>';
			$("#options").append(HTML);
		}
		document.getElementById("description").innerHTML = (allCourses[0].description);
		addChoice = 0;
	}
	else
	{
		alert("error in getting all classes");
	}
	
	$("#dialog").dialog("open");
	
};

//callback for initializing all course on page
//If success, create HTML for the new course and append to page
function addClass(result, error)
{
	if(error == "success")
	{
		var courses = result.Courses;
		myCourse = courses;
		sessionStorage.setItem("courses", courses);
		for(var i = 0; i< courses.length; i++)
		{
			var courseID = courses[i].courseId;
			var courseName = courses[i].name;
			var addClassHTML = '<fieldset class="courseFieldset"><legend><h3>' + courseName + '</h3></legend><div class="oneCourse" id="' + courseID + '"> <button id = "quiz" value = "'+ courseID+'">take quiz</button><div class="divider"></div><button id = "result" value = "'+ courseID+'">Result</button></div></fieldset>';
			$("#moreClass").append(addClassHTML);
			$(".courseFieldSet").buttonset();
		}

	}
	else
		alert(error + ": There is an error: getting courses");
};


//event for when the add button is clicked in dialog
function addCourse(event, template)
{
	var q = {"userId" : userid};
	$.ajax({
	    type: 'POST',
	    url: 	url +"courses/" + allCourses[addChoice].courseId + "/join",
	    data: JSON.stringify(q),
	    success: addCourseCallBack,
	    error: addCourseCallBack,
	    contentType: "application/json",
	    dataType: 'json'
	});
};

//callback for adding a course
//If success, create HTML for the new course and append to page
function addCourseCallBack(result, error)
{
	if(error == "success")
	{
		myCourse.push({"courseid": result.courseId, "name" : result.name, "description": allCourses[addChoice].description});
		sessionStorage.setItem("courses", myCourse);
		var courseID = result.courseId;
		if(courseID == null)
			{
			courseID = result.classId;
			}
		var courseName = result.name;
		var addClassHTML = '<fieldset class="courseFieldset"><legend><h3>' + courseName + '</h3></legend><div class="oneCourse" id="' + courseID + '"> <button id = "quiz" value = "'+ courseID+'">take quiz</button><div class="divider"></div><button id = "result" value = "'+ courseID+'">Result</button></div></fieldset>';
		$("#moreClass").append(addClassHTML);
		$(".courseFieldSet").buttonset();
		$('#dialog').dialog("close");
	}
	else
	{
		alert("Course already existed");
		$('#dialog').dialog("close");
	}
};
