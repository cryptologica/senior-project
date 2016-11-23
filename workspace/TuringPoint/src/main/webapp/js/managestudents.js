$(document).ready(function() {
	
	window.studentResultHTMLBase = $('#storageBox').html();
	$('#storageBox').remove();
	
	var role = sessionStorage.getItem('role');
	var courseID = sessionStorage.getItem('courseID');
	
	if(courseID == null)
		loadPage("login");

	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/courses/" + courseID + "/students";

	// Ask the server for a list of courses available for current user
	$.getJSON(url, studentListCallback);
	
	if(role == null)
		loadPage("login");
	else if (role == "STUDENT"){
		
		
	} else if (role == "INSTRUCTOR"){
		
	} else
		loadPage("login");
	
	$("#studentContent").hide();
	
	//$("#manualGrade1").bootstrapSwitch({offColor: 'info', onColor:'success', inverse:'true', offText:'Auto', onText:'Credit'});
	//$("#manualGrade1m").bootstrapSwitch({offColor: 'info', onColor:'success', inverse:'true', offText:'Auto', onText:'Credit'});
	//$("#manualGrade1s").bootstrapSwitch({offColor: 'info', onColor:'success', inverse:'true', offText:'Auto', onText:'Credit'});
	//$("#manualGrade2").bootstrapSwitch({offColor: 'info', onColor:'success', inverse:'true', offText:'Auto', onText:'Credit'});
	//$("#manualGrade2m").bootstrapSwitch({offColor: 'info', onColor:'success', inverse:'true', offText:'Auto', onText:'Credit'});
	//$("#manualGrade2s").bootstrapSwitch({offColor: 'info', onColor:'success', inverse:'true', offText:'Auto', onText:'Credit'});

	////for tag exploring
	$(document).on('click', '.tagClose', function(event) {
		untagClickHandler(this)
		
	});
	$(document).on('click', '.tptag',function(event){
		openTagExplorer(this)
	});
});

$(document).on('click', '.studentButton', function(event)
{
	var userID = $(this).attr("userId");
	
	// Make other questions inactive
	var questions = $('.studentButton');
	for (var i=0; i < questions.length; i++) {
		$(questions[i]).removeClass('active');
	}
	// Make the question user selected active
	$(this).addClass("active");		// bootstrap class for making button appear selected
	
	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/users/" + userID;
	
	$('#studentResultsInfoDiv').empty();
	$('#studentResultsInfoDiv').append("<div class='block text-center'><span class='fa-spin fa fa-refresh fa-5x'></span></div>");
	
	$.getJSON(url, studentInfoCallback);
	
});

function studentListCallback(data, status){
	if(status == "success"){
		
		//var lectures = data.Lectures;
		//console.log(data)
		var students = data["Students"]
		console.log(data);
		
		// Start building HTML for sidebar
		var sidebarHTML = 
			'<button class="visible-xs btn btn-primary btn-block" data-toggle="collapse" data-target="#side-menu"><div><label>Student List</label></div></button>'+
			"<div class=\"navbar-default sidebar\" role=\"navigation\" style=\"margin-top: 16px;\"  >"+
                "<div class=\"sidebar-nav\">"+
                    "<ul class=\"nav in\" id=\"side-menu\">";
		
		if(students != undefined && students.length > 0)
		{
			sidebarHTML +=
			"<div class=\"text-center\"><label>Students In Course <span class=\"badge\">"+ students.length +"</span></label></div>";
		}
		for(var i = 0; i < students.length; i++) 
		{
			sidebarHTML += "<button userID=\""+students[i]["userId"]+"\" type=\"button\" class=\"list-group-item studentButton\">"+students[i]["lName"]+", "+students[i]["fName"]+"</button>";
		}
		
		// Close HTML tags for sidebarHTML
		sidebarHTML +=
			"   		</ul>"+
	                "</div>"+
	                "<!-- /.sidebar-collapse -->"+
	            "</div>"+
	            "<!-- /.sidebar-collapse -->";
		
		
		$("#mainNav").append(sidebarHTML);
			
		if(students != undefined && students.length > 0)
			{
				selectFirstStudent(students[0]["userId"]);
				$("#studentContent").show();
			}
				
		if(students == undefined || students.length <= 0)
			{	
				appendNoStudentssMessage();
				$("#noStudentBox").append(noStudentsHTML());
			}
		
		$("#loadIndicator").remove();
	}
}

function selectFirstStudent(userID)
{
	var studentId = $.query.get('studentId');	// If prev URL student id set
	if(studentId != null && studentId != ""){
		$('[userid="'+studentId+'"]').click();
	} else {
		var baseURL = sessionStorage.getItem("baseURL");
		var url = baseURL + "/users/" + userID;
		$('.studentButton:first').addClass("active");
		
		$.getJSON(url, studentInfoCallback);
	}
}

function studentInfoCallback(data, status)
{
	if(status == "success")
	{
		console.log(data)
		if("imageURL" in data && data.imageURL != null)
			$("#profileImage").attr("src", data["imageURL"]);
		else
			$("#profileImage").attr("src", "../img/userIcon_s.png" );
		
		$("#fname").html(data["fName"]);
		$("#lname").html(data["lName"]);
		$("#email").html(data["email"]);
		$("#studentId").html(data["studentId"]);
		
		
		
		//call for student results
		getStudentResults(data["userId"]);
	}
}
/**
 * Get HTML for no students in a course  (jumbotron)
 */
function noStudentsHTML(){
	var noStudentsHTML = 
		'<div class="jumbotron" id="noStudents">'+
			'<h1>'+'There are currently no students registered for this course'+'</h1>'+
			'<p>'+'Students will have to register for the course before they can answer questions'+'</p>'+
		'</div>';
	return noStudentsHTML;
}
/**
 * Places a message in sidebar telling the user that there are no questions.
 */
function appendNoStudentssMessage() {
	var noStudentsHTML = '<div class="well well-lg" id="noStudentssWell">No students are registered for this course. You must have students register to review their information.</div>'
	$("#side-menu").append(noStudentsHTML);
}

function getStudentResults(studentID)
{
	var baseURL = sessionStorage.getItem("baseURL");
	//var lectureID = sessionStorage.getItem('lectureID');
	var courseID = sessionStorage.getItem('courseID');
	var url = baseURL + "/results/" + courseID +"/student/" + studentID;
	//var url2 = baseURL + "/courses/" + courseID + "/students"

	// Ask the server for a list of courses available for current user
	$.getJSON(url, getStudentResultsCallback);
	//$.getJSON(url2,getStudentsInClassCallback);
}

function getStudentResultsCallback(data,status)
{
	if(status == "success"){

		//window.lectureResults = data;
		
		$('#studentResultsInfoDiv').empty();
		
		
		buildStudentResults(data["studentResults"])
		

	}
}



/*
 * Builds a student results display object to be inserted into the DOM
 */
function buildStudentResults(data)
{
	console.log(data);
	
	window.totalLecturesToRetrieve = data.length; // this must be set for results
	for(var i = 0 ; i < data.length; i++)
	{
		var iterationHTML = window.studentResultHTMLBase;
		var lectureID = data[i]["lectureID"];
		var lectureName = data[i]["lectureName"];
		$("#studentResultsInfoDiv").append("<div correlation='"+lectureID+"'></div>");
		
		var targetBox = $("#studentResultsInfoDiv").find("[correlation='"+lectureID+"']");
		targetBox.append(iterationHTML);
		targetBox.find(".lectureName").text(lectureName);
		var questionBase = targetBox.find(".questionCollection").html();
		targetBox.find(".questionCollection").empty();
		
		targetBox.find(".panel-heading").attr("href","#toggle"+lectureID);
		targetBox.find("#toggle").attr("id","toggle"+lectureID);
		
		//modify base row tooltips
		targetBox.find("#questionCorrectnessTooltip").attr("id","questionCorrectnessTooltipLEC"+lectureID);
		targetBox.find("#questionScoreTooltip").attr("id","questionScoreTooltipLEC"+lectureID);
		targetBox.find("#questionCreditTooltip").attr("id","questionCreditTooltipLEC"+lectureID);
		
		//participationStatus
		var totalRespondanded = 0;
		var totalPublished = 0;
		var totalScore = 0;
		var totalPossiblePointsForLecture = 0;
		
		var lectureResults =  data[i]["lectureResults"];
		for(var j = 0; j <lectureResults.length; j++)
		{
			var pointsForThisQuestion = 0;
			var totalPossibleForQuestion = lectureResults[j]["value"];
			totalPossiblePointsForLecture += lectureResults[j]["value"];
			var qID = lectureResults[j]["qID"];
			var questionTitle = lectureResults[j]["title"];
			var totalCorrectOptions = 0;
			var totalCorrectAnswers = 0;
			var margin = lectureResults[j]["margin"];
			var questionDate = "<i> No response </i>";
			
			//For each question.........
			var questionHome = targetBox.find(".questionCollection").append("<div qid='"+qID+"'></div>");
			questionHome = questionHome.find("[qid='"+qID+"']");
			questionHome.append(questionBase);
			questionHome.find(".questionTitle").each(function(){$(this).html(questionTitle);});
			
			//console.log(lectureResults[j]);
			if(lectureResults[j]["respondants"] > 0)
			{
				//need to parse answers then and see what point value we earned
				for(var k = 0; k < lectureResults[j]["results"].length; k++)
				{
					if(lectureResults[j]["results"][k]["correct"])
					{
						totalCorrectOptions++;
						if(lectureResults[j]["results"][k]["users"].length > 0)
						{
							totalCorrectAnswers++;
							//add points when they are implemented, for now just add one
							//pointsForThisQuestion = pointsForThisQuestion + 1;
						}
					}
					
					if(lectureResults[j]["results"][k]["users"].length > 0)
					{
						questionDate = lectureResults[j]["results"][k]["users"][0]["date"];
						//since this is always per student, it should only ever have one user in it
						pointsForThisQuestion = pointsForThisQuestion + lectureResults[j]["results"][k]["users"][0]["points"]
					}

				}
				totalRespondanded++;
				
				if(totalCorrectAnswers == totalCorrectOptions)
				{
					questionHome.find(".questionCorrectness").each(function(){$(this).html("<span class='label label-success'>Correct</span>");});
				}
				else if(totalCorrectAnswers > 0)
				{
					if(margin == null)
					{
						questionHome.find(".questionCorrectness").each(function(){$(this).html("<span class='label label-warning'>Partial</span>");});
					}
					else
						questionHome.find(".questionCorrectness").each(function(){$(this).html("<span class='label label-success'>Correct</span>");});
				}
				else
					questionHome.find(".questionCorrectness").each(function(){$(this).html("<span class='label label-danger'>Incorrect</span>");});
				
				totalScore += pointsForThisQuestion;
				
			}
			else
			{
				questionHome.find(".questionCorrectness").each(function(){$(this).html("<span class='label label-default'>No answer</span>");});
			}
			
			
			if(lectureResults[j]["published"])
			{
				questionHome.find(".questionPublished").each(function(){$(this).html("<span class='label label-success'>Published</span>");});
				totalPublished ++;
			}
			else
				questionHome.find(".questionPublished").each(function(){$(this).html("<span class='label label-danger'>Not Published</span>");});
			
			questionHome.find(".questionDate").each(function(){$(this).html(questionDate);});
			questionHome.find(".questionPoints").each(function(){$(this).html(pointsForThisQuestion+ " / " + totalPossibleForQuestion);});
			questionHome.find(".questionTags").each(function(){$(this).html(buildTagWell('sm',''));});
			
		}
		
		//finalize lecture display
		targetBox.find(".numAnswered").text(totalRespondanded);
		targetBox.find(".numPublished").text(totalPublished);
		targetBox.find("#pointScore").text(totalScore + " / " + totalPossiblePointsForLecture);
		targetBox.find(".lectureTagBox").html(buildTagWell('sm','lecTagWell'));
		
		//get tags for this lecture - calls to tagging.js
		getLectureTags(lectureID,1);
		
		var participationStatus = "Non Participant";
		if(totalRespondanded == lectureResults.length)
		{
			participationStatus = "Active Participant";
		}
		else if(totalRespondanded != 0 )
		{
			participationStatus = "Partial Participant";
		}
		targetBox.find(".participationStatus").html(participationStatus);
		
	}
	
	

}
