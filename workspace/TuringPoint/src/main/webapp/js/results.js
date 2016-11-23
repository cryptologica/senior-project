$(document).ready(function() {

	//console.log("winner")
	$("#detailPanel").hide();
	
	var role = sessionStorage.getItem('role');
	var lectureID = sessionStorage.getItem('lectureID');
	var lectureName = sessionStorage.getItem('lectureName');

	var queryLectureID = $.query.get('lectureId');
	if(queryLectureID != null && queryLectureID != ''){
		lectureID = queryLectureID;
		queryString.push('lectureId', lectureID);
	}
	
	if(lectureID == null)
		loadPage("login");

	var baseURL = sessionStorage.getItem("baseURL");
	//var url = baseURL + "/lecture/" + lectureID + "";

	// Ask the server for a list of courses available for current user
	//$.getJSON(url, resultQuestionListCallback);
	
	var url = baseURL + "/results/" + lectureID +"/lecture";
	$.getJSON(url, resultLectureResultsCallback);
	
	createTaggingUI("#taggingUIcontainer");
	
	if(role == null)
		loadPage("login");
	else if (role == "STUDENT"){
		
		
	} else if (role == "INSTRUCTOR"){
		
	} else
		loadPage("login");
	
	//getAllQuestionsWithTag(2);
	
	$('#taggingUIcontainer').hide();
	
	////for tag exploring
	$(document).on('click', '.tagClose', function(event) {
		untagClickHandler(this,event)
		
	});
	$(document).on('click', '.tptag',function(event){
		openTagExplorer(this)
	});
	
});

//When clicking on a row in the table....
$(document).on('click', ".generatedTableRow.clickableTableRow.lectureRow", function(event)
		{
		    var questionID = $(this).attr("rowid");
		    //$('#taggingUIcontainer').show(); - move this line so it gets called by button and table row clicking
		    $("button[questionid$='"+questionID+"']").click();	
		});

//When clicking on a row in the table....
$(document).on('click', ".generatedTableRow.clickableTableRow.optionRow", function(event)
		{
		    var rowID = $(this).attr("rowid");
		    //console.log();
		    var optionText = $(this).find(".optionname").text()
		    var correct = $(this).hasClass("pollCorrectAnswer");
		    encaseUsersAndMakeTheTable(inquisition(rowID),optionText,correct);
		    //console.log(users);
		});

$(document).on('click', '.questionButton', function(event)
		{
			var questionID = $(this).attr("questionID")
			$('#taggingUIcontainer').show();
			selectQuestionFromExistingData(questionID)
		});

$(document).on('click', '#lectureOverview', function(event)
		{
			selectLecture();
			$('#taggingUIcontainer').hide();
		});


$(window).on('resize', function(event)
		{
			if(window.ResultVisData != undefined)
			{
				resultsVis = new VisHistogram("#chartHome" ,ResultVisData);
				resultsVis.SetupVisualization();
			}
		});

function resultLectureResultsCallback(data, status){
	if(status == "success"){

		window.lectureResults = data;
		
		var baseURL = sessionStorage.getItem("baseURL");
		var lectureID = sessionStorage.getItem('lectureID');
		//var courseID = sessionStorage.getItem('courseID');
		var url = baseURL + "/lecture/" + lectureID + "";
		//var url2 = baseURL + "/courses/" + courseID + "/students"

		// Ask the server for a list of courses available for current user
		$.getJSON(url, resultQuestionListCallback);
		//$.getJSON(url2,getStudentsInClassCallback);
	}
}

function getStudentsInClassCallback(data, status)
{
	if(status == "success"){
		
		window.studentList = data;
		console.log(data);
		//fill in lecture data last
		fillInLectureData(window.lectureResults,status);
	}
}

function resultQuestionListCallback(data, status){
	if(status == "success"){
		
		$("#lectureName").html(data.name);
		sessionStorage.setItem('lectureName', data.name);
		
		//var lectures = data.Lectures;
		//console.log(data)
		var questions = data["QS"]
		
		// Start building HTML for sidebar
		var sidebarHTML = 
			
			"<div class=\"navbar-default sidebar\" role=\"navigation\">"+
                "<div class=\"sidebar-nav navbar-collapse\" id=\"side-menu-parent\">"+
                    "<ul class=\"nav in\" id=\"side-menu\">";
		
		
		
		if(questions != undefined && questions.length > 0)
		{
			//label for list
			sidebarHTML +=
			"<br>"+
			"<div class=\"text-center\">" +
			"	<button class=\"btn btn-outline btn-primary center-block\" type=\"button\" id=\"lectureOverview\">Lecture Overview</button>" +
			"	<br>" +
			"	<label>Questions in Lecture</label>" +
			"</div>" +
			"";
			
			
			
			//Dynamically generate student list
			sidebarHTML +=
			"<div class=\"list-group\">";
				
			for(var i = 0; i < questions.length; i++) 
			{
				sidebarHTML += "<button questionID=\""+questions[i]["questionId"]+"\" type=\"button\" class=\"list-group-item questionButton\">"+questions[i]["title"]+"</button>";
			}
	
			sidebarHTML +=
			"</div>";
		}
		
		// Close HTML tags for sidebarHTML
		sidebarHTML +=
			"   		</ul><br>";
		
		if(questions != undefined && questions.length > 0)
		{
			sidebarHTML +=
				"<button class=\"btn btn-outline btn-primary center-block\" type=\"button\" id=\"exportTestLink\">Export Lecture Results</button>";
		}
		
		sidebarHTML +=
	                "</div>"+
	                "<!-- /.sidebar-collapse -->"+
	            "</div>"+
	            "<!-- /.sidebar-collapse -->";
		
		$("#mainNav").append(sidebarHTML);
		
		if(questions == undefined || questions.length <= 0)
		{
			appendNoQuestionMessage();
		}
		
		if(questions != undefined && questions.length > 0)
		{
			var baseURL = sessionStorage.getItem("baseURL");
			var courseID = sessionStorage.getItem('courseID');
			var url2 = baseURL + "/courses/" + courseID + "/students"
	
			// Ask the server for a list of courses available for current user
			$.getJSON(url2,getStudentsInClassCallback);
			
			
		}
	}
}

function appendNoQuestionMessage(){
	$("#contentHolder").empty();
	var noLecturesHTML = 
		'<div class="col-sm-12">'+
			'<div class="block text-center">'+
				'<div class="jumbotron" id="noLectures">'+
					'<h1>No Questions for this course</h1>'+
					'<p>Results can only be reviewed after questions are created in <a href="#" id="managePollsRedirect">Lecture Management</a></p>'+
				'</div>'+
			'</div>'+
		'</div>'
	$("#contentHolder").append(noLecturesHTML);
}

/**
 * Instructor - Manage polls redirect link clicked
 */
$(document).on('click', '#managePollsRedirect', function(event) {
	loadPage("managepolls");
});
