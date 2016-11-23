
var Class = [ "HTML for Beginners", "Math for VideoGamers"];
var allCourses = [];
var idName = "Unavailable";
var userid = "";
var addChoice = "";

function initialize()
{
	userid = sessionStorage.getItem("userid");
	if(userid == null)
	{
		loadPage("login");
		return;
	}
	var fname = sessionStorage.getItem("fname");
	var lname = sessionStorage.getItem("lname");
	document.getElementById('nameLine').innerHTML = fname + " " + lname;
	
	var url = sessionStorage.getItem("baseURL");
	
	$.getJSON( url + "courses", allClass);
	// Replaces:
	//HTTP.call("GET", url +"courses", allClass);
	
	$.ajax({
	    type: 'GET',
	    url: 	url + "users/" + userid + "/courses",
	    data: data,
	    success: addClass,
	    contentType: "application/json",
	    dataType: 'json'
	});
	
	// Replaces:
	//HTTP.call("GET", url +"users/" + userid + "/courses",  addClass);

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

function allClass(data, status)
{
	if(status == "success")
	{
		allCourses = data.Courses;
		for(var i = 0; i < allCourses.length;i++)
		{
			var HTML = '<option value = "' + i+'">'+ allCourses[i].name+ '</option>';
			$("#options").append(HTML);
		}
		document.getElementById("instructorName").innerHTML = allCourses[0].instFName + " " + allCourses[0].instLName;
		document.getElementById("description").innerHTML = (allCourses[0].description);
		addChoice = 0;
	}
	else
	{
		alert("error in getting all classes");
	}
	
};

function addClass(data, status)
{
	if(status == "success")
	{
		var courses = data.Courses;
		sessionStorage.setItem("courses", courses);
		for(var i = 0; i< courses.length; i++)
		{
			var courseID = courses[i].courseId;
			var courseName = courses[i].name;
			var addClassHTML = '<ul id="box"><li><h2>'+courseName+'</h2></li></ul><ul id="classContainer"><li id="inline"><button id = "quiz" value = "'+ courseID+'">take quiz</button></li><li id="inline"><button id = "result" value = "'+ courseID+'">Result</button></li></ul>';
			$("#moreClass").append(addClassHTML);
		}
	}
	else
		alert(error + ": There is an error: getting courses");
};

Template.homepage.events({
	'click #quiz': function (event, template) {
		HTTP.call("GET", url+"courses/" + event.currentTarget.value + "/status", quizCallback);
		sessionStorage.setItem("current", event.currentTarget.value);
	}
});

function quizCallback(data, status)
{
	var QS = data.QS;
	if(status == "success" && QS.length != 0)
	{		
		sessionStorage.setItem("QS", QS);
		
		// TODO: Route to take quiz
		//Router.go("/takeQuiz");
	}
	else
	{
		alert("No quiz active");
	}
};

Template.addCourse.events({
	'click #options': function (event, template) {
		document.getElementById("instructorName").innerHTML = allCourses[event.currentTarget.value].instFName + " " + allCourses[event.currentTarget.value].instLName;
		document.getElementById("description").innerHTML = allCourses[event.currentTarget.value].description;
		addChoice = event.currentTarget.value;
	}
});

Template.homepage.events({
	'click #add': function () {
	event.preventDefault();
	$("#dialog").dialog("open");
	}
});

function addCourse(event, template)
{
	var data = JSON.stringify({
		"userId": parseInt(userid)
	});
	
	$.ajax({
	    type: 'POST',
	    url: url + "courses/" + allCourses[addChoice].courseId + "/join",
	    data: data,
	    success: addClass,
	    contentType: "application/json",
	    dataType: 'json'
	});
	
	// Replaces:
	//HTTP.post(url + "courses/" + allCourses[addChoice].courseId + "/join", {data : {"userId" : userid}}, addCourseCallBack);
	
};


function addCourseCallBack(data, status)
{
	if(status == "success")
	{
		myCourse.push({"courseid": result.data.courseId, "name" : result.data.name, "description": allCourses[addChoice].description});
		sessionStorage.setItem("courses", myCourse);
		var courseID = data.courseId;
		var courseName = data.name;
		var addClassHTML = '<ul id="box"><li><h2>'+courseName+'</h2></li></ul><ul id="classContainer"><li id="inline"><button id = "quiz" value = "'+ courseID+'">take quiz</button></li><li id="inline"><button id = "result" value = "'+ courseID+'">Result</button></li></ul>';
		$("#moreClass").append(addClassHTML);
		$('#dialog').dialog("close");
	}
	else
	{
		alert("course was not added");
		$('#dialog').dialog("close");
	}
};
