
// function to start when the page is loaded
//window.onload = initialize();
$(document).ready(initialize());

function initialize()
{
	localStorage.removeItem("QS");	// Clear existing question set
	sessionStorage.removeItem("questionID");	// Clear any existing active question
	sessionStorage.removeItem("lastUpdate");
	
	baseURL = sessionStorage.getItem("baseURL");
	userid = sessionStorage.getItem('userID');
	courseID = parseInt(sessionStorage.getItem("courseID"));
	sessionStorage.setItem("answer", "");
	checkQuestionStatus();
};

$(window).resize(function(){
	resize();
});

function resize()
{
	var t = document.getElementById("collapseOne");
	if ($(window).width() <= 800){	
		
		t.setAttribute("class", "panel-collapse collapse");
	}
	else
		{
		t.setAttribute("class", "panel-collapse collapse in");
		}
}

/**
 * Fetches the full question list to see what has changed
 */
function checkQuestionStatus(){
	
	$.ajaxSetup({
	    cache: false
	});
	$.ajax({
		    method : 'GET',
		    ContentType: 'application/json', 
		    url : baseURL +"/courses/" + courseID + "/status",
		    success: questionStatusCallback,
		    error: questionStatusCallback
		    });
}

/**
 * Checks the time that the last update happened
 */
function checkLastUpdateTime(){
	
	console.log("About to fetch last time update.");
	$.ajax({
	    method : 'GET',
	    ContentType: 'application/json', 
	    url : baseURL +"/courses/" + courseID + "/lastUpdate",
	    success: function(result, status){
	    	console.log("Received time since last update.");
	    	var lastUpdate = sessionStorage.getItem("lastUpdate");
	    	if(lastUpdate != result.lastUpdate){
	    		console.log("Lecture status has changed, fetching new questions");
	    		checkQuestionStatus();		// Re-fetch the questions list to see what has changed
	    		return;
	    	}
	    	setTimeout(checkLastUpdateTime, 20000);	// Re-fetch question status after timeout
	    },
	    error: function(result, status){
	    	console.log("Error while fetching the last update time.");
	    }
	    });
}

/**
 * Callback after getting the list of available questions
 */
function questionStatusCallback(result, status)
{
	
	console.log("Received question list");
	
	//$('#myModal').modal('show');
	$("#studentMainNav").empty();
	var qs = result.QS;
	if(status = "success" && qs.length > 0)
	{
		var testQS = JSON.parse(localStorage.getItem("QS"));
		
		if(!equal(qs, testQS)){	// If question list has been modified
			
			console.log("Quesiton list is new or has been modified.");
			
			var questionID = sessionStorage.getItem("questionID");
			//var curVersion = $('[name='+questionID+']').attr('version');	// Grab current version before it goes away
			var curVersion = sessionStorage.getItem("curVersion");
			var questionList = [];
			var index = 0;
			
			$("#qs").empty();
			resize();
			// Append questions to the questions list
			for(var i = 0; i < qs.length; i++)
			{
				//var addHTML = '<li class="list-group-item" id = "'+qs[i].questionId+'"><span class="glyphicon glyphicon-file"></span><a href="#Q1" id="question" name = "'+qs[i].questionId+'">'+qs[i].title+'</a></li>';
				var addHTML = '<a href="#" class="list-group-item" id="question" name = "'+qs[i].questionId+'" version='+qs[i].version+'><span class="glyphicon glyphicon-file"></span>'+qs[i].title+'</a>';
				$("#qs").append(addHTML);
				questionList.push(qs[i].questionId);
				
			}
			
			$('[name='+questionID+']').addClass('active');	// Select active question on list
			
			localStorage.setItem("QS", JSON.stringify(qs));	// Store new/updated question list
			
			if(questionID == null){	// If no active question, fetch the first one
				var currQID = JSON.parse(sessionStorage.getItem("currQID"));
				questionID = qs[0].questionId;
				if(currQID != null)
				{
					questionID = currQID;
					var questionStillActive = false;
					for(var i=0; i < qs.length; i++){	// Check to see if current question is still available
						var curQuestion = qs[i];
						if(curQuestion.questionId == questionID){
							questionStillActive = true;
							index = i;
						}
					}
					if(!questionStillActive)
					{
						questionID = qs[0].questionId;
						$('#closedAlert').html(generateAlertNonDismiss('<strong>The previous question was closed</strong> — You are now viewing the next available question.', "col-md-12", 3));
					}
				}
				sessionStorage.setItem("questionList", JSON.stringify(questionList));
				sessionStorage.setItem("index", index);
				sessionStorage.setItem("questionID", questionID);
				$.ajax({
				    method : 'GET',
				    ContentType: 'application/json', 
				    url : baseURL +"/question/" + questionID,
				    success: questionCallback,
				    error: questionCallback
				    });
			} 
			else {	// A question is already loaded
				
				// Handle when already on a question
				var questionStillActive = false;
				$("#nextQuestionButton").css("visibility", "hidden");
				$("#previousQuestionButton").css("visibility", "hidden");
				for(var i=0; i < qs.length; i++){	// Check to see if current question is still available
					var curQuestion = qs[i];
					if(curQuestion.questionId == questionID){
						questionStillActive = true;
						index = i;
						sessionStorage.setItem("index",index);
						sessionStorage.setItem("questionList", JSON.stringify(questionList));
						if(curQuestion.version != curVersion){
							// Update question and alert user of question change
							$('#updateAlert').html(generateAlertNonDismiss('<strong>This question has been updated</strong> — Please review the question and re-submit your answer if needed.', "col-md-12", 3));
							$('#alertBox').attr("updateId", questionID);	// Track which question this alert was applied to
							loadNewQuestion(questionID);
							break;
						}
					}
				}
				var ql = JSON.parse(sessionStorage.getItem("questionList"));
				var index = parseInt(sessionStorage.getItem("index"));
				if(index == 0 && index != ql.length-1 )
					{
					$("#nextQuestionButton").css("visibility", "");
					}
				else if(index == ql.length-1 && index != 0)
					{
					$("#previousQuestionButton").css("visibility", "");
					}
				else if(index != ql.length-1 && index != 0)
					{
					$("#nextQuestionButton").css("visibility", "");
					$("#previousQuestionButton").css("visibility", "");
					}
				else
					{
					
					}
				// Check if the currently-selected question is no longer available
				if(!questionStillActive){
					// Re-load new question and alert user
					$('#closedAlert').html(generateAlertNonDismiss('<strong>The previous question was closed</strong> — You are now viewing the next available question.', "col-md-12", 3));
					$('#alertBox').attr("closedId", questionID);	// Track which question this alert was applied to
					loadNewQuestion(qs[0].questionId);	// Load first question
					index = 0;
					sessionStorage.setItem("index",index);
					sessionStorage.setItem("questionList", JSON.stringify(questionList));
				}
			}
			
		} else
			console.log("Question list unchanged.");

		sessionStorage.setItem("lastUpdate", result.lastUpdate);	// Timestamp for when course status was last updated
		setTimeout(checkLastUpdateTime, 20000);	// Re-fetch question status after timeout
	}
	else
	{
		type = -1;
		alert("No active questions available.  Moving to homepage.");
		loadPage("home_student");
	}
};

/**
 * Clicking on a question
 */
$(document).on('click', '#question', function(event)
{
	event.preventDefault();
	questionID = event.currentTarget.name;
	loadNewQuestion(questionID);
});

/**
 * Load a new question with the provided questionId
 */
function loadNewQuestion(questionID){
	
	sessionStorage.setItem("currQID", questionID);
	// Handle any warnings from auto updating
	var closedId = $('#alertBox').attr("closedId");	// The question ID where alert was generated for question being closed
	var updateId = $('#alertBox').attr("updateId");	// The question ID where alert was generated for question being updated
	if(closedId != null){	// If a question was previously closed
		$('#alertBox').removeAttr('closedId');	// Clear flag for next time
	} else {
		$('#closedAlert').empty();	// Clear any alert messages
	}
	if(updateId != null){	// If a question was previously updated
		$('#alertBox').removeAttr('updateId');	// Clear flag for next time
	} else {
		$('#updateAlert').empty();	// Clear any alert messages
	}
	
	var ql = JSON.parse(sessionStorage.getItem("questionList"));
	var index = parseInt(sessionStorage.getItem("index"));
	for(var i = 0; i < ql.length; i++)
		{
			if(ql[i] == questionID)
				{
					index = i;
					break;
				}
		}
	sessionStorage.setItem("index", index);
	sessionStorage.setItem("questionID", questionID);
	$('div[id="formError"]').empty();
	$.ajax({
		    method : 'GET',
		    ContentType: 'application/json', 
		    url : baseURL +"/question/" + questionID,
		    success: questionCallback,
		    error: questionCallback
		    });
}

$(document).on('click', "#textBox", function(event)
		{
		$('div[id="formError"]').empty();
		});

$(document).on('click', "#previousQuestionButton", function(event)
		{
			event.preventDefault();
			var index = parseInt(sessionStorage.getItem("index"));
			var ql = JSON.parse(sessionStorage.getItem("questionList"));
			if(index != 0)
				{
				loadNewQuestion(ql[index -1]);
				}
		});

$(document).on('click', "#nextQuestionButton", function(event)
		{
			event.preventDefault();
			var index = parseInt(sessionStorage.getItem("index"));
			var ql = JSON.parse(sessionStorage.getItem("questionList"));
			if(index != ql.length)
				{
					loadNewQuestion(ql[index +1]);
				}
		});
//event handler for saving an answer
$(document).on('click', '#options', function(event)
{
	event.preventDefault();
	$('div[id="formError"]').empty();
	//Get variables from server for quiz page, save variable in session
	
	//get questionId and name from class list
	var answer = $(this).attr("name");
	//sessionStorage.setItem("select",answer);
	sessionStorage.setItem("answer", answer);
});

//event handler for saving an answer
$(document).on('click', '#mButton', function(event)
{
	event.preventDefault();
	$('div[id="formError"]').empty();
	var answer = JSON.parse(sessionStorage.getItem("answer"));
	var check = $(this).attr("box");
	var circle = $(this).attr("circle");
	var circleGreen = $(this).attr("circleGreen");
	if(circleGreen == "true")
		{
		$(this).attr("circleGreen", false);
		$("#"+circle).css("color", "black");
		}
	else
		{
		$(this).attr("circleGreen", true);
		$("#"+circle).css("color", "green");
		}
	//
	var temp = [];
	if(document.getElementById(check).checked)
		{
			document.getElementById(check).checked = false;
			var optid = $(this).attr("optID");
			for(var i = 0; i < answer.length; i++)
				{
					if(parseInt(optid) != parseInt(answer[i]))
						{
							temp.push(answer[i]);
						}
				}
			answer = temp;
		}
	else
		{
			document.getElementById(check).checked = true;
			var optid = $(this).attr("optID");
			answer.push(optid);
		}
	sessionStorage.setItem("answer", JSON.stringify(answer));
});

var answer;
//event handler for sending answer to server
$(document).on('click', '#saveAnswer', function(event)
{
	
	event.preventDefault();
	var courseID = parseInt(sessionStorage.getItem("courseID"));
	saveAnswer();

});


function saveAnswer()
{
	var questionID = sessionStorage.getItem("questionID");
	var version = (sessionStorage.getItem("curVersion"));
	if(type == 0)	// Multiple-Choice question type
	{
		var answer = JSON.parse(sessionStorage.getItem("answer"));
		
		//Get variables from server for quiz page, save variable in session
		var q = {"userId" : userid, "optionId" : answer, "version" : version};
		
		$.ajax({
	    	type: 'POST',
	    	url: 	baseURL +"/question/" + questionID + "/answer",
	    	data: JSON.stringify(q),
	    	success: answerCallback,
	    	error: saveQuestionErrorCallback,
	    	contentType: "application/json",
	    	dataType: 'json'
	});
	}
	
	else if(type == 1)	// Fill-In-Blank
		{
		var answer = $("#textBox").val();
		if(answer == "undefined" || answer == null || answer == "")
			{
				//$('div[id="formError"]').html( generateAlert("Invalid Answer : Empty answer is not accepted.", 2) );
				displayAlertWithTimeout('div[id="formError"]', generateAlert("answer was saved", 1), 2000);
			}
		else
			{
			var q = {"userId" : userid, "response" : answer, "version" : version};

			$.ajax({
		    	type: 'POST',
		    	url: 	baseURL +"/question/" + questionID + "/answer",
		    	data: JSON.stringify(q),
		    	success: answerCallback,
		    	error: saveQuestionErrorCallback,
		    	contentType: "application/json",
		    	dataType: 'json'
		});
			}
		}
	else if(type == 2)
	{
		var answer = JSON.parse(sessionStorage.getItem("answer"));
		if(answer.length >0)
			{
		var q = {"userId" : userid, "optionIds" : answer, "version" : version};

		$.ajax({
	    	type: 'POST',
	    	url: 	baseURL +"/question/" + questionID + "/answer",
	    	data: JSON.stringify(q),
	    	success: answerCallback,
	    	error: saveQuestionErrorCallback,
	    	contentType: "application/json",
	    	dataType: 'json'
	});
			}
		else
			{
			//$('div[id="formError"]').html( generateAlert("At least 1 answer must be selected", 2) );
			displayAlertWithTimeout('div[id="formError"]', generateAlert("At least 1 answer must be selected", 2), 2000);
			}
		}
	else if(type == 3)
	{
	var answer = $("#textBox").val();
	if(answer == "undefined" || answer == null || answer == "")
		{
			//$('div[id="formError"]').html( generateAlert("Invalid Answer : Empty answer is not accepted.", 2) );
			displayAlertWithTimeout('div[id="formError"]', generateAlert("Invalid Answer : Empty answer is not accepted.", 2), 2000);
		}
	else
		{
		answer = Number(answer);
		if(!answer && answer != 0.0)
			{
				//$('div[id="formError"]').html( generateAlert("Invalid Answer : Answer must be a number.", 2) );
				displayAlertWithTimeout('div[id="formError"]', generateAlert("Invalid Answer : Answer must be a number.", 2), 2000);
			}
		else{
			answer = answer.toString();
		var q = {"userId" : userid, "response" : answer, "version" : version};

		$.ajax({
	    	type: 'POST',
	    	url: 	baseURL +"/question/" + questionID + "/answer",
	    	data: JSON.stringify(q),
	    	success: answerCallback,
	    	error: saveQuestionErrorCallback,
	    	contentType: "application/json",
	    	dataType: 'json'
	});
			}
		}
	}
	else if(answer == null || answer == "")
		{
			//$('div[id="formError"]').html( generateAlert("No answer selected", 3) );
			displayAlertWithTimeout('div[id="formError"]',generateAlert("No answer selected", 3), 2000);
			//$('#myModal').modal('hide');
		}	
};


function saveQuestionErrorCallback(result, status) {

	if(result.status == 403){
		var addHTML = generateAlertNonDismiss("This question is no longer available", "", 1);
		//$("#qs").append(addHTML);
		$('div[id="formError"]').html( addHTML );
	}
};


function questionCallback(result, error)
{
	//$('#myModal').modal('show');
	if(error == "success")
	{

		$("#questionTitle").empty();
		$("#questionQuestion").empty();
		$("#questionContent").empty();
		$("#questionTitle").css("visibility","hidden");
		$("#questionQuestion").css("visibility","hidden");
		$("#questionContent").css("visibility","hidden");
		$("#saveAnswer").css("visibility", "hidden");
		$("#nextQuestionButton").css("visibility", "hidden");
		$("#previousQuestionButton").css("visibility", "hidden");
		
		console.log(result);
		var content = result.content;
		type = result.type;
		var options = result.options;
		sessionStorage.setItem("callbackResult", JSON.stringify(result));
		var title = result.title;
		var version = result.version;
		
		sessionStorage.setItem("curVersion",version);
		
		var addHTML = title+'<h2 style = "float : right"></h2>';
		$("#questionTitle").append(addHTML);
		$("#questionQuestion").append(content);

		if(type == 0)
		{
			addHTML = '<div class="btn-group-vertical" id ="questionContent2" style="width:100%" data-toggle="buttons">';
			$("#questionContent").append(addHTML);
			for(var i = 0; i < options.length; i++)
			{
				addHTML = '<label class="btn btn-default" id="options" name="'+options[i].optionId+'" style="text-align: left;white-space: normal;"><input class="btn btn-default" type="radio" id="option" name="'+options[i].optionId+'" autocomplete="off">'+options[i].text+'</label>';
				$("#questionContent2").append(addHTML);
			}
        
			
		}
		else if(type == 1)
		{
			addHTML = '<textarea class="form-control" rows="4" style="width:100%; resize: none" id="textBox" placeholder="My answer is..." spellcheck="true"></textarea>';
			$("#questionContent").append(addHTML);
		}
		else if(type == 2)
		{
			addHTML = '';
			for(var i = 0; i < options.length; i++)
			{
				addHTML = '<div = class = "row"><input type="checkbox" disabled id = "check'+i+'" style="height:15px;width:0;margin-left:5px;margin-right:5px;visibility:hidden"><label for="check'+i+'"><i class="fa fa-circle" style="height:15px;width:10%;"></i></label><button class = "btn btn-default" style="text-align: left;white-space: normal;width:90%" id="mButton" box = "check'+i+'" data-toggle="buttons">'+options[i].text+'</button><div>';
				$("#questionContent").append(addHTML);
			}
			
		}
		else if(type == 3)
		{	
			
			addHTML = '<strong>Only numerical responses will be accepted</strong><br><textarea class="form-control" rows="1" style="width:100%; resize: none;overflow-y : hidden" id="textBox" placeholder="3.141" spellcheck="true"></textarea>';
			$("#questionContent").append(addHTML);
		}
		
		//For code highlighting
		Prism.highlightAll();
	}
	else
	{
		//$('div[id="formError"]').html( generateAlert("Unknown type asked", 4) );
		displayAlertWithTimeout('div[id="formError"]', generateAlert("Unknown type asked", 4), 2000);
		console.log(type);
	}
	//MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	//$('#myModal').modal('hide');
	userid = sessionStorage.getItem('userID');
	questionID = sessionStorage.getItem('questionID');
	console.log(questionID);
	
	// Update selected active question on quesiton list
	$('[name]').removeClass('active');
	$('[name='+questionID+']').addClass('active');
	//$('.panel-collapse').collapse('hide');
	
	$.ajax({
	    method : 'GET',
	    ContentType: 'application/json', 
	    url : baseURL +"/results/" + questionID +"/question/"+userid +"/poll",
	    success: getAnswerCallback,
	    error: getAnswerCallback
	    });
};

function getAnswerCallback(result, error)
{
	if(error=="success")
		{
			var results = result.results;
			var callbackResult = JSON.parse(sessionStorage.getItem("callbackResult"));
			var options = callbackResult.options;
			var answer;
			if(results.length > 0)
				{
				if(callbackResult.type == 0)
					{
						$("#questionContent2").empty();
						for(var i = 0; i < options.length; i++)
						{
							for(var j = 0; j< results.length; j++)
							{
								if(results[j].id == options[i].optionId)
									{
										addHTML = '<label class="btn btn-default" id="options" name="'+results[j].id+'" style="text-align: left;white-space: normal;"><input class="btn btn-default" type="radio" id="option" name="'+results[j].id+'" autocomplete="off">'+results[j].name+'</label>';
							
										if(results[j].count > 0)
										{
											addHTML = '<label class="btn btn-default active" id="options" name="'+results[j].id+'" style="text-align: left;white-space: normal;background-color:#FEFE6F"><input class="btn btn-default" type="radio" id="option" name="'+results[j].id+'" autocomplete="off">'+results[j].name+'</label>';
											answer = results[j].id;
										}
									}
							}
							$("#questionContent2").append(addHTML);
						}
					}
				else if(callbackResult.type == 1)
					{
					//$('#myModal').modal('show');
					//console.log(results[0].name);
						//$("#textBox").append(results[0].name);
						//document.getElementById("textBox").innerHTML = results[0].name;
						//answer = results[0].name;
						fillInBlankAnswerGrab(results);
					}
				else if(callbackResult.type == 2)
				{
					answer = [];
					$("#questionContent").empty();
					$("#questionContent").append('<strong>Choose all possible answers.</strong><br><br>');
					for(var i = 0; i < options.length; i++)
					{
						for(var j = 0; j < results.length; j++)
						{
							if(results[i].count > 0)
							{
								addHTML = '<div = class = "row"><input type="checkbox" disabled id = "check'+i+'" style="height:15px;width:0px;margin-left:5px;margin-right:5px;visibility:hidden" checked= true><label for="check'+i+'"><i class="fa fa-circle" id = "circle'+i+'" style="height:15px;width:10%;color:green"></i></label><button circle = "circle'+i+'" circleGreen = true class = "btn btn-default" id="mButton" style="text-align: left;white-space: normal;background-color:#FEFE6F;width:90%" optID = "'+results[i].id+'" box = "check'+i+'" data-toggle="buttons">'+results[i].name+'</button><div>';
								answer.push(results[i].id);
								break;
							}
							else
							{
								addHTML = '<div = class = "row"><input type="checkbox" disabled id = "check'+i+'" style="height:15px;width:0px;margin-left:5px;margin-right:5px;visibility:hidden"><label for="check'+i+'"><i class="fa fa-circle" id = "circle'+i+'" style="height:15px;width:10%;"></i></label><button circle = "circle'+i+'" circleGreen = false class = "btn btn-default" style="text-align: left;white-space: normal;width:90%;background:transparent" id="mButton" optID = "'+results[i].id+'" box = "check'+i+'" data-toggle="buttons">'+results[i].name+'</button><div>';
							}
						}
						$("#questionContent").append(addHTML);
					}
					
				}
				
				else if(callbackResult.type == 3)
				{
				//$('#myModal').modal('show');
				//console.log(results[0].name);
					//$("#textBox").append(results[0].name);
					//document.getElementById("textBox").innerHTML = results[0].name;
					//answer = results[0].name;
					fillInBlankAnswerGrab(results);
				}
				
				sessionStorage.setItem("answer", JSON.stringify(answer));
		        
				}
			else
				{
					answer = null;
					sessionStorage.setItem("answer", JSON.stringify(answer));
					console.log("no answer available");
				}
		}
	else
		{
		
		}
	MathJax.Hub.Queue(["Typeset",MathJax.Hub], function(){$("#questionTitle").css("visibility","");
	$("#questionQuestion").css("visibility","");
	$("#questionContent").css("visibility","");
	$("#saveAnswer").css("visibility", "");
	var ql = JSON.parse(sessionStorage.getItem("questionList"));
	var index = parseInt(sessionStorage.getItem("index"));
	if(index == 0 && index != ql.length-1 )
		{
		$("#nextQuestionButton").css("visibility", "");
		}
	else if(index == ql.length-1 && index != 0)
		{
		$("#previousQuestionButton").css("visibility", "");
		}
	else if(index != ql.length-1 && index != 0)
		{
		$("#nextQuestionButton").css("visibility", "");
		$("#previousQuestionButton").css("visibility", "");
		}
	else
		{
		
		}
	});
	//$('html, body').animate({scrollTop:$(document).height()}, 'slow');
	//$('#myModal').modal('hide');
};

function answerCallback(result, error)
{
	if(error == "success")
	{
		var questionID = sessionStorage.getItem("questionID");
		$("#questionTitle").css("visibility","hidden");
		$("#questionQuestion").css("visibility","hidden");
		$("#questionContent").css("visibility","hidden");
		$("#saveAnswer").css("visibility", "hidden");
		$("#nextQuestionButton").css("visibility", "hidden");
		$("#previousQuestionButton").css("visibility", "hidden");
		
		
		if(type == 0)	// Multiple-Choice question type
		{
			var selected = sessionStorage.getItem("answer");
			$('label[id = "options"]').css("background-color", "")
			$('label[name = "'+selected+'"]').css("background-color", "#FEFE6F");
		}
		
		else if(type == 1)	// Fill-In-Blank
			{
				//no change after save
			}
		else if(type == 2)
		{
			//multiple answer not done yet
			var select = JSON.parse(sessionStorage.getItem("answer"));
			$('button[id = "mButton"]').css("background-color", "")
			for(var i = 0; i < select.length; i++)
			{
				$('button[optID = "'+select[i]+'"]').css("background-color", "#FEFE6F");	
			}
		}
		else if(type == 3)
		{
			//no change after save
		}
		MathJax.Hub.Queue(["Typeset",MathJax.Hub], function(){$("#questionTitle").css("visibility","");
		$("#questionQuestion").css("visibility","");
		$("#questionContent").css("visibility","");
		$("#saveAnswer").css("visibility", "");
		var ql = JSON.parse(sessionStorage.getItem("questionList"));
		var index = parseInt(sessionStorage.getItem("index"));
		if(index == 0)
			{
			$("#nextQuestionButton").css("visibility", "");
			}
		else if(index == ql.length-1)
			{
			$("#previousQuestionButton").css("visibility", "");
			}
		else
			{
			$("#nextQuestionButton").css("visibility", "");
			$("#previousQuestionButton").css("visibility", "");
			}
		});
		displayAlertWithTimeout('div[id="formError"]', generateAlert("answer was saved", 1), 2000);
		//$('div[id="formError"]').html( generateAlert("answer was saved", 1) );

	}
	else
	{
		//checkQuestionStatus();
	}
	//$('#myModal').modal('hide');
};

//Fills in fill in blank or numeric answer
function fillInBlankAnswerGrab(data)
{
	for(var j = 0; j< data.length; j++)
	{
		//If the answer has count > 0 then its our answer
		if(data[j].count > 0)
		{
			document.getElementById("textBox").innerHTML = data[j].name;
			answer = data[j].name;
			break
		}
	}
}
