//Relies on vis histogram file to be existing to work
//when mousing over a specific kind of row
$(document).on('mouseover', ".generatedTableRow.clickableTableRow.optionRow", function(event)
		{
				var relatedID = $(this).attr('rowid');
				var selectedRect = d3.select("g[rowid='" + relatedID + "'] > rect");
				selectedColor = selectedRect.style("fill");
				
				selectedRect.transition().style("fill","lightgrey");		
		});

//relies on vis histogram file to be existing to work
//when mousing over a specific kind of row
$(document).on('mouseout', ".generatedTableRow.clickableTableRow.optionRow", function(event)
		{
			var relatedID = $(this).attr('rowid');
			var selectedRect = d3.select("g[rowid='" + relatedID + "'] > rect");
			
			selectedRect.transition().style("fill",selectedColor);
		});

//When mousing into a clickable row
$(document).on('mouseover', ".clickableTableRow", function(event)
		{
		    $(this).css("background-color",'#ddd');
		});

//When mousing out of a clickable row
$(document).on('mouseout', ".clickableTableRow", function(event)
		{
		    $(this).css("background-color",'#fcfcfc');
		});


//For use in live settings
function selectQuestion(questionID) {
	window.ResultVisData = undefined;
	window.ResultQuestionID = questionID;
	window.ResultQuestionData = undefined;

	$("#detailPanel").hide();

	var baseURL = sessionStorage.getItem("baseURL");
	var url2 = baseURL + "/question/" + questionID;
	var url = baseURL + "/results/" + questionID + "/question";
	
	$.getJSON(url, makeHistogramFromData);
}

//Avoids double result calls since lecture results already have response numbers
function selectQuestionFromExistingData(questionID) {
	window.ResultVisData = undefined;
	window.ResultQuestionID = questionID;
	window.ResultQuestionData = undefined;
	
	renderTagsForQuestion(questionID);

	$("#detailPanel").hide();
	$("#subcontentHolder").empty();

	var lectureData = window["lectureResults"];
	
	//console.log(lectureData["lectureResults"]);
	
	var targetIndex = -1;
	for(var i = 0 ; i < lectureData["lectureResults"].length  ; i++)
		{
			if(questionID == lectureData["lectureResults"][i]["qID"])
				{
				targetIndex = i;
				break;
				}
		}
	
	makeHistogramFromData(lectureData["lectureResults"][targetIndex],"success");
}

function selectLecture()
{
	fillInLectureData(window["lectureResults"],"success");
	window.ResultQuestionID = undefined;
}

function fillInLectureData(data, status) {
	if (status == "success") {
		
		console.log(data);
		
		$("#contentHolder").empty();
		
		$("#subcontentHolder").empty();
		var wiggles = "<div class=\"col-md-12\">"+
    			"<h2><i>Click on an question to get more detailed response information</i></h2>"+
    		"</div>";
		$("#subcontentHolder").append(wiggles);

		
		//console.log(data);

		var resultHTML = "" +
		"<div class=\"col-sm-12\">"+
		"<div id=\"detailPanel\" class=\"panel panel-default\">"+
				
					"<Table id=\"optionTable\" width=\"100%\" class=\" table \">" +
						"<tr class=\"generatedTableRow \"><th class=\"text-center\">"+data["lectureResults"].length+" Questions in Lecture</th><th class=\"text-center\"></th><th class=\"text-center\"></th>" +
						"<tr class=\"generatedTableRow resultTableHeader\"><th>Question Name</th><th class=\"text-center\">Responding Participants</th><th class=\"text-center\">Percent Correct</th>";

	
		
		//add rows for each question
		
		var lectureCorrectness = 0;
		var questionsCompleted = 0;
		

		
		//for every question
		for (var i = 0; i < data["lectureResults"].length; i++) {
			
			var uniqueResponses =  data["lectureResults"][i]["respondants"];
			var totalResponses = 0;
			if(uniqueResponses > 0)
				{
				questionsCompleted++;
				}
			
			var iterData = data["lectureResults"][i];
			
			var numCorrect = getCorrectResults(iterData);
			
			//console.log(iterData["results"].length);
			//for every option in every question
			
			for (var j = 0; j < iterData["results"].length; j++)
			{
				//totalResponses += getResultCount(iterData["results"][j]["id"],iterData)
				totalResponses += iterData["results"][j]["count"]
				
			}
			
			//console.log(data["lectureResults"][i]["qID"] + " " + uniqueResponses + " " + totalResponses + " " + numCorrect);
			var correctnessPercent = ((numCorrect / totalResponses)*100);

			if(isNaN(correctnessPercent))
				{
					correctnessPercent =0;
				}

			lectureCorrectness += correctnessPercent;

			
			resultHTML += "<tr class=\"generatedTableRow clickableTableRow lectureRow\" rowid=\""+(data["lectureResults"][i]["qID"])+ "\"><td>"+iterData["title"]+"</td><td class=\"text-center\">"+uniqueResponses+"</td><td class=\"text-center\">"+(correctnessPercent).toFixed(2)+"%</td>";

			
		}
		
		//determine overall correctnes
		var finalCorrectness = lectureCorrectness / questionsCompleted;
		if(isNaN(finalCorrectness))
		{
			finalCorrectness =0;
		}

		resultHTML+="<tr class=\"generatedTableRow resultTableHeader\"><th class=\"text-center\">Class Question Participation</th><th class=\"text-center\"></th><th class=\"text-center\">Overall Response Correctness</th>";
		resultHTML+="<tr class=\"generatedTableRow\"><td class=\"text-center\">"+questionsCompleted+" questions with responses</th><th class=\"text-center\"></th><th class=\"text-center\">"+(finalCorrectness).toFixed(2)+"%</th>";

		resultHTML+= ""+
					"</Table>"+
					"</div>"+
					
				"</div>";
		
		$("#contentHolder").append(resultHTML);
	}
}


function makeHistogramFromData(data, status) {
	//console.log(data)
	//console.log(success)
	if (status == "success") {
		
		
		if(window.isResultsExplorer)
		{
			//console.log("firing results explorer callback in make histrogram")
			nameStuffInExplorer(data);
		}
		
		window.ResultVisData = data;
		console.log(data);

		$("#contentHolder").empty();
		
		if(data["respondants"] > 0)
			{
		
				//var currentWidth = $(window).width();
				var currentWidth = $("#contentHolder").width();
		
				
				var largeSize = 500;
				var medSize = 250;
				var size = largeSize;
				
				//If the window is small enough that it fits in this type of situation....
				if(currentWidth > 765)
				{
					size = currentWidth/2;
				}
				else
				{
					size = currentWidth;
				}
				
				
				if(window.isResultsExplorer)
				{
					largeSize = medSize;
				}
				
				
				//console.log(currentWidth);
				//console.log(size);
				if(window.isResultsExplorer)
				{
					
					var alternateContentText =""+
					"<ul id='tabbedContent' class='nav nav-tabs' data-tabs='tabs'>"+
					  "<li class='active'><a data-toggle='tab' href='#chartHome'>Chart</a></li>"+
					  "<li><a data-toggle='tab' href='#table'>Details</a></li>"+
					"</ul>"+
					"<div id='alt-tab-content' class='tab-content'>"+
				        "<div class='tab-pane active' id='chartHome'>"+
				        	"<svg id=\"chartCanvas\" width=\""+ size +"\" height=\""+largeSize+"\"></svg>" +
				        "</div>"+
				        "<div class='tab-pane' id='table'>"+
					        "<div id=\"detailPanel\" class=\"panel panel-default\">"+
								"<div class=\"panel-heading\">"+
									"<div class=\"h4 text-left\" id=\"questionTitle\">Question Title</div>"+
								"</div>"+
								"<div class=\"panel-body\">"+
									"<label id=\"questionText\">Question Text</label>"+
									"<Table id=\"optionTable\" width=\"100%\" class=\" table \" >"+
									"</Table>"+
								"</div>"+
							"</div>"+
				        "</div>"+
			        "</div>"+
			        "<div id='subcontentHolder' class='row'>";
					$("#contentHolder").append(alternateContentText);
					$('#tabbedContent').tab();
				}
				else
				{
					//Add content pane for question
					var contentHolderText = "" +
						"<div class=\"col-md-6\" id=\"chartHome\">"+
							"<svg id=\"chartCanvas\" width=\""+ size +"\" height=\""+largeSize+"\" style = \"background-color:white\"></svg>" +
						"</div>"+
						"<div class=\"col-md-6\">"+
							"<div id=\"detailPanel\" class=\"panel panel-default\">"+
								"<div class=\"panel-heading\">"+
									"<div class=\"h4 text-left\" id=\"questionTitle\">Question Title</div>"+
								"</div>"+
								"<div class=\"panel-body\">"+
									"<label id=\"questionText\">Question Text</label>"+
									"<div class='table-responsive'><Table id=\"optionTable\" width=\"100%\" class=\" table \" >"+
									"</Table></div>"+
								"</div>"+
							"</div>"+
						"</div>";
					$("#contentHolder").append(contentHolderText);
				}
				window.resultVis = new VisHistogram("#chartHome", data);
				window.resultVis.SetupVisualization();
		
				var baseURL = sessionStorage.getItem("baseURL");
				//var url = baseURL + "/results/" + questionID +"/question";
				var url2 = baseURL + "/question/" + window.ResultQuestionID;
		
				
				//resize fix
				$(window).trigger('resize');
				
				$.getJSON(url2, fillInDetailData);
			}
		else
			appendNoResponseMessage();
	
	}
}

function redrawResults()
{
	var data = window.ResultVisData;
	var size = $("#contentHolder").width();
	
	if(size > 600)
	{
		size = size/2;
	}
	
	$("#chartCanvas").attr('width', size);
	
	//console.log("hit chart cavnas like a boss, it is now : " + $("#chartCanvas").css("width") );
	
	if(window.resultVis != undefined)
		window.resultVis.SetupVisualization();
	//window.resultVis.DrawVisualization();

}

function fillInDetailData(data, status) {
	if (status == "success") {
		$("#optionTable").find(".generatedTableRow").remove();
		//console.log(data)
		//console.log(window.ResultVisData)

		window.ResultQuestionData = data;
		
		
		$("#subcontentHolder").empty();		
		var wiggles = "<div class=\"col-md-12\">"+
			"<h2><i>Click on an response to see who provided it as an answer</i></h2>"+
			"</div>";
		$("#subcontentHolder").append(wiggles);

		$("#detailPanel").show();

		$("#questionTitle").html(
				sessionStorage.getItem('lectureName') + " | " + data["title"]);
		$("#questionText").html(data["content"]);

		var totalResponses = 0

		var tableHTML = "<tr class=\"generatedTableRow resultTableHeader\"><th>Correct</th><th>Response</th><th class=\"text-center\">Number of Responses</th><th class=\"text-center\">Percentage of Total</th>";

		if (data["type"] == 1) {

		}

		
		var mostpopularRowID = -1;
		var currentMostResponses = 0;
		var clearFavorite = true;
		
		var uniqueResponses =  window.ResultVisData["respondants"];
		
		for (var i = 0; i < window.ResultVisData["results"].length; i++) {
			//totalResponses += getResultCount(window.ResultVisData["results"][i]["id"],window.ResultVisData)
			totalResponses += window.ResultVisData["results"][i]["count"];
		}

		for (var i = 0; i < window.ResultVisData["results"].length; i++) 
		{
			var answerClass = "pollIncorrectanswer";
			var correctIconText = "";
			//var responseCount = getResultCount(window.ResultVisData["results"][i]["id"],window.ResultVisData)
			var responseCount = window.ResultVisData["results"][i]["count"];
			var correct = window.ResultVisData["results"][i]["correct"];
			if(correct)
				{
				answerClass = "pollCorrectAnswer";
				correctIconText = "<span class=\"fa fa-arrow-right\"></span>";
				}
			
			//determine if this answer is more popular than the current most popular
			if(responseCount > currentMostResponses)
				{
					mostpopularRowID = window.ResultVisData["results"][i]["rowid"];
					currentMostResponses = responseCount;
				}
			//determine if there is a clearly most popular answer, if not note it
			else if ( responseCount == currentMostResponses)
				{
					clearFavorite = false;
				}

			var responsePercent = (responseCount / totalResponses) * 100
			if (totalResponses == 0)
				responsePercent = 0;
			
			//window.ResultVisData["results"][i]["id"]
			tableHTML += "<tr class=\"generatedTableRow clickableTableRow optionRow "+answerClass+"\" rowid="+(window.ResultVisData["results"][i]["rowid"])+ "><td class=\"correctness\">"+correctIconText+"</td><td class=\"optionname\">"
					+ window.ResultVisData["results"][i]["name"] + "</td><td class=\"text-center\">"
					+ responseCount + "</td><td class=\"text-center\">" + responsePercent.toFixed(2)
					+ "\%</td></tr>"
		}
		
		//find the most popular answer

		//Add rows for aggregate results
		tableHTML += "<tr class=\"generatedTableRow resultTableHeader\"><th></th><th class=\"text-center\">Unique Respondants</th><th class=\"text-center\">Total Responses</th><th></th></tr>";
		tableHTML += "<tr class=\"generatedTableRow\"><td></td><td class=\"text-center\">"
				+ uniqueResponses + "</td><td class=\"text-center\">"
				+ totalResponses + "</td><td></td></tr>";

		$("#optionTable").append(tableHTML);
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,"optionTable" ]);
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,"questionText" ]);
		//MathJax.Hub.Queue(["Typeset",MathJax.Hub,"chartHome" ]);
		
		//For code highlighting
		Prism.highlightAll();

	}
}

function inquisition(rowid)
{
	//window.ResultQuestionData
	
	for(var i = 0; i < window.ResultVisData["results"].length; i++)
	{
		var option = window.ResultVisData["results"][i];
		if(option["rowid"] == rowid)
		{
			return option["users"];
		}
	}
	
}

function encaseUsersAndMakeTheTable(userData,optionText,correct)
{
	var subcontentHolder = $("#subcontentHolder");
	
	if(subcontentHolder === 'undefined')
		return;
	
	$("#subcontentHolder").empty();
	
	
	var resHTML = "<div class=\"col-md-12\">";
	
	var correctnessText = "<span class=\"pollIncorrectAnswer\"><b>incorrect</b></span>";
	if(correct)
		{
			correctnessText = "<span class=\"pollCorrectAnswer\">correct</span>";
		}
	
	resHTML += "<div class=\"panel panel-default\">"+
	"<div class=\"panel-heading\">"+
		"<div class=\"h4 text-left\" id=\"\">The following users selected the "+correctnessText+" answer : "+ optionText+"</div>"+
	"</div>"+
	"<div class=\"panel-body\">";
	
	//userData = userData.split(",")
	//console.log(userData);
	if(userData.length >0)
	{
		resHTML += "<Table id=\"respondantsTable\" width=\"100%\" class=\"table \" >"+ 
				"<tr class=\"generatedTableRow resultTableHeader\"><th>Student ID</th><th>Name</th><th>Response Date</th></tr>";

		for(var i = 0 ; i < userData.length; i++)
		{
			var user;
			var dataPoint = userData[i];
			//console.log(dataPoint);
			//console.log(window.studentList["Students"]);
			//console.log(window.studentList["Students"].length);
			for (var j = 0; j < window.studentList["Students"].length; j++)
			{
				
				if(userData[i]["userID"] == window.studentList["Students"][j]["userId"])
				{
					user = window.studentList["Students"][j];
					break;
				}
			}
			//render me a row batman
			//console.log(user);
			resHTML += "<tr class=\"generatedTableRow clickableTableRow\" userid=\""+user["userId"]+"\"><td>"+user["studentId"]+"</td><td>" + user["lName"] + ", " + user["fName"] + "</td><td>"+userData[i]["date"]+"</td></tr>";
		}
		
		resHTML +=	"</Table>";
		
	}
	else
	{
		resHTML += "<h2><i>No users Selected this response.</i></h2>";
	}
	
	resHTML += //"</div>"+
			//"</div>"+
		"</div>";
	
	//console.log(resHTML);
	$("#subcontentHolder").append(resHTML);
}



//This thing is defunct and garbo, gonna remove next build - Tony
function getResultCount(optionId,data) {
	var ret = 0;

	//console.log(data);
	
	for (var i = 0; i < data["results"].length; i++) {
		if (data["results"][i]["id"] == optionId && data["results"][i]["count"] > 0)
			ret = data["results"][i]["count"];
	}

	return ret
}

//counts how many are correct
function getCorrectResults(data)
{
	var ret = 0;

	//console.log(data);
	
	for (var i = 0; i < data["results"].length; i++) {
		if (data["results"][i]["correct"] == true && data["results"][i]["count"] > 0)
			ret = ret + data["results"][i]["count"];;
	}

	return ret
}

function getResultSize(data)
{
	var size = 0;
	
	for(key in data)
		{
			if(data.hasOwnProperty(key))
				size++;
		}
}


function appendNoResponseMessage(){
	$("#contentHolder").empty();
	var noResponsesHTML = 
		'<div class="col-sm-12">'+
			'<div class="block text-center">'+
				'<div class="jumbotron" id="noLectures">'+
					'<h1>No Responses for this Question</h1>'+
					'<p>There are currently no recorded responses</p>'+
				'</div>'+
			'</div>'+
		'</div>'
	$("#contentHolder").append(noResponsesHTML);
}