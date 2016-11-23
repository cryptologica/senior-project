// When click "Add Answer"
$(document).on('click', '#addAnswerBtn', function(event) {
	var newAnswer = '<div class="questionAnswerBlock"><button type="button" class="deleteAnswerBtn">Delete</button> <input placeholder="Answer" type="text" name="answer"> <span class="correctRadioBtn"><input type="radio" name="ans" value="' + -1 + '">Correct</span></div>';
	$('#questionOptionBox').append(newAnswer);
	$('#addAnswerBtn').button().blur();
	$('.deleteAnswerBtn').button();
});

// When play button is clicked
$(document).on('click', '.img-swap', function(event) {
	
	var questionID = $(this).closest('.playBtnGroup').find('.questionGroup').attr('id');
	// Determine if question should be started or stopped
	if ($(this).attr('src').includes('_off')) {
		setQuestionActive(questionID);
	}
	else {
		setQuestionInactive(questionID);
	}

	// Swap on/off images on click
    if ($(this).attr("class") == "img-swap") {
    	this.src = this.src.replace("_off","_on");
    }
    else {
    	this.src = this.src.replace("_on","_off");
    }
      $(this).toggleClass("on");
});

// When click "Delete Answer"
$(document).on('click', '.deleteAnswerBtn', function(event) {
	// Don't let them delete it if it's the only answer
	var numElements = $('.questionAnswerBlock').length;
	if (numElements == 1) {
		$(this).button().blur();
		alert("Error: Every question is required to have at least one answer!");
		return;
	}

	// Is 'to-be-deleted' element a correct answer?
	var isChecked = false;
	if ($(this).parent().find('input[type="radio"]').is(":checked")) {
		isChecked = true;
	}

	// Delete the answer
	$(event.currentTarget).closest('.questionAnswerBlock').remove();

	// Select first answer as correct if they deleted correct answer
	if (isChecked) {
		$('.correctRadioBtn input:first').prop('checked', true);
	}
});

// When change Question Type (radio button)
$(document).on('change', '#questionType input[type="radio"]', function(event) {
	qType = $(this).val();
	if (qType == 0) {
		$('#questionOptionBox').show();
		$('#addAnswerBtn').show();

		// TODO: When more types available might want a better strategy
		$('#fillInBlankDiv').hide();
	}
	if (qType == 1) {
		$('#fillInBlankDiv').show();

		$('#questionOptionBox').hide();
		$('#addAnswerBtn').hide();
		$('#fillInBlankDivHidden').hide();
	}
});

// Toggle "Show Answer" check-box
$(document).on('click', '#showAnswerCheckbox', function(event) {
	$('.correctRadioBtn').toggle();
	$('#fillInBlankToggle').toggle();
});

// When click on a question (load question)
$(document).on('click', '#resultsGroups button', function(event) {
	$(this).button().blur();
	$('.playBtnGroup').css("border-color", "#053D70");
	var questionID = $(this).attr('id');
	var url = sessionStorage.getItem("baseURL") + "/question/" + questionID;
	$.ajax({
		  method: "GET",
		  url: url,
		  complete: loadQuestionCallback
	});
});

// When click "Save"
$(document).on('click', '#saveBtn', function(event) {
	$(this).blur();
	var data = new Object();
	data.type = parseInt($('#questionType input[type="radio"]:checked').val());
	var shouldUpdate = false;
	if (sessionStorage.getItem("currQuestion") != "null") {
		shouldUpdate = true;
	}

	// MULTIPLE CHOICE
	if (data.type == 0) {
		data.title = $('#questionTitleText').val();
		data.content = $('#questionContentText').val();
		data.feedback = "";
		data.value = parseInt("1");
		data.group = parseInt("-1");
		data.lectureId = parseInt(sessionStorage.getItem("lectureID"));
		data.options = [];
		var numAnswers = 0;
		var checkedAnswer = -1;
		var exit = false;
		var answer;
		$('.questionAnswerBlock input[type="text"]').each(function() {
			numAnswers++;
			answer = {text: $(this).val()};
			if (exit) {
				return;
			}
			if (answer.text == "") {
				alert("Error: One or more answers are empty!");
				exit = true;
				return;
			}
			if (shouldUpdate) {
				answer.optionId = parseInt($(this).parent().find('input[type="radio"]').val());
			}
			data.options.push(answer);
			if ($(this).parent().find('input[type="radio"]').is(':checked')) {
				checkedAnswer = numAnswers;
			}
		});
		if (exit) {
			return;
		}
		if (checkedAnswer <= 0) {
			alert("You must select one question as 'correct'!");
			return;
		}
		if (numAnswers <= 0) {
			alert("You must have at least one answer per question!");
			return;
		}
		// Set <option index>
		data.answer = parseInt(checkedAnswer - 1);
	}
	// FILL-IN-THE-BLANK
	else if (data.type == 1) {
		data.title = $('#questionTitleText').val();
		data.content = $('#questionContentText').val();
		data.feedback = "";
		data.value = parseInt("1");
		data.group = parseInt("-1");
		data.lectureId = parseInt(sessionStorage.getItem("lectureID"));
		data.answer = $('#fillInBlankDiv input[type="text"]').val();
		if (data.answer == "") {
			alert("Error: The answer field is blank!");
			return;
		}
	}
	// UNSUPPORTED
	else {
		// TODO: Add support for other question types
		alert("Error: Unsupported question type!");
		return;
	}
	if (data.title == "" || data.content == "") {
		alert("Error: One or more fields are missing!");
		return;
	}

	// UPDATE
	if (shouldUpdate) {
		var questionID = sessionStorage.getItem("currQuestion");
		$('.questionGroup#'+questionID+' span').text(data.title);
		var url = sessionStorage.getItem("baseURL") + "/question/" + questionID + "/update";
		$.ajax({
			  method: "PUT",
			  url: url,
			  contentType: "application/json",
			  data: JSON.stringify(data),
			  complete: updateQuestionCallback
		});
	}
	// NEW QUESTION
	else {
		var url = sessionStorage.getItem("baseURL") + "/question/create";
		$.ajax({
			  method: "POST",
			  url: url,
			  contentType: "application/json",
			  data: JSON.stringify(data),
			  complete: saveQuestionCallback
		});
	}
});

//When click "New Question"
$(document).on('click', '#newQuestionBtn', function(event) {
	// Remove colored border from selected question
	$('.playBtnGroup').css("border-color", "#053D70");
	// Save normally, do not 'update' new questions
	sessionStorage.setItem("currQuestion", null);
	// Set to default question type (MULT CHOICE)
	$('#questionType input[value="0"]').prop('checked', true).trigger("change");
	// Set title text
	$('#questionTitleText').val("");
	// Set question content text
	$('#questionContentText').val("");

	// Remove any previous answers
	$('.questionAnswerBlock').remove();

	// Populate answers
	var defaultNumQ = 4;
	var optionID;
	for (var i=0; i<defaultNumQ; i++) {
		optionID = -1;
		var newAnswer = '<div class="questionAnswerBlock"><button type="button" class="deleteAnswerBtn">Delete</button> <input placeholder="Answer" type="text" name="answer"> <span class="correctRadioBtn"><input type="radio" name="ans" value="' + optionID + '">Correct</span></div>';
		$('#questionOptionBox').append(newAnswer);
		var answerText = "";
		$('.questionAnswerBlock input[type="text"]:last').val(answerText);
	}
	$('.questionAnswerBlock button').button();
	$('#newQuestionBtn').button().blur();

	// Select correct answer radio button
	var answerToSelect = "";
	$('.questionAnswerBlock input[type="radio"]:first').prop('checked', true);
});

/**
 * Updates the question statuses for the play/stop buttons.
 * @param result
 */
function updateQuestionStatuses() {
	var courseID = sessionStorage.getItem("courseID");
	var url = sessionStorage.getItem("baseURL") + "/courses/" + courseID + "/status";
	$.ajax({
		  method: "GET",
		  url: url,
		  complete: updateQuestionStatusesCallback
	});
}

/**
 * Called in response to getting the list of active questions.
 * @param data
 * @param status
 */
function updateQuestionStatusesCallback(data, status) {
	if (status == "success") {
		var result = data.responseJSON;
		var questionsList = result.QS;
		var i, questionID, title, version;
		for (i=0; i < questionsList.length; i++) {
			questionID = questionsList[i].questionId;
			title = questionsList[i].title;
			version = questionsList[i].version;
			// Set each question in list to "ON" (red stop icon)
			var playBtn = $('.questionGroup#'+questionID).closest('.playBtnGroup').find('img')[0];
			playBtn.src = playBtn.src.replace("_off","_on");
		    $(playBtn).toggleClass("on");
		}
		$('.playBtnGroup').show();
	}
	else {
		alert("Error loading questions/statuses!");
	}
}

/**
 * Sets the question with the given questionID to ACTIVE.
 * @questionID
 */
function setQuestionActive(questionID) {
	var data = new Object();
	var courseID = sessionStorage.getItem("courseID")
	data.courseId = parseInt(courseID);
	var url = sessionStorage.getItem("baseURL") + "/question/" + questionID + "/start";
	$.ajax({
		  method: "POST",
		  url: url,
		  contentType: "application/json",
		  data: JSON.stringify(data),
		  complete: setQuestionActiveCallback
	});
}

/**
 * Called when the request to the server about starting a question completes.
 * @param data
 * @param status
 */
function setQuestionActiveCallback(data, status) {
	var result = data.responseJSON;
	var questionID;
	// Start question was successful
	if (status == "success") {
		questionID = result.questionId;
		console.log("Question #" + questionID + " started!");
	}
	// Failed to start question
	else {
		// We at least got data back from server
		if (typeof result !== 'undefined') {
			alert("There was a server error starting this question. Please try again.");
			console.log("Question Start Error: Status = "+status+" Result = "+result);
		}
		// Server-side error
		else if (data.status == 500) {
			alert("Failed to start question: " + data.statusText);
		}
		// Got nothing, connection issue?
		else {
			alert("Error: Failed to start question. Server connection issue detected, try reloading page?");
		}
	}
}

/**
 * Sets the question with the given questionID to INACTIVE.
 * @questionID
 */
function setQuestionInactive(questionID) {
	var data = new Object();
	var courseID = sessionStorage.getItem("courseID")
	data.courseId = parseInt(courseID);
	var url = sessionStorage.getItem("baseURL") + "/question/" + questionID + "/end";
	$.ajax({
		  method: "POST",
		  url: url,
		  contentType: "application/json",
		  data: JSON.stringify(data),
		  complete: setQuestionInactiveCallback
	});
}

/**
 * Called when the request to the server about stopping a question completes.
 * @param data
 * @param status
 */
function setQuestionInactiveCallback(data, status) {
	var result = data.responseJSON;
	var questionID;
	// Stop question was successful
	if (status == "success") {
		questionID = result.questionId;
		console.log("Question #" + questionID + " stopped!");
	}
	// Failed to start question
	else {
		// We at least got data back from server
		if (typeof result !== 'undefined') {
			alert("There was a server error stopping this question. Please try again.");
			console.log("Question Stop Error: Status = "+status+" Result = "+result);
		}
		// Server-side error
		else if (data.status == 500) {
			alert("Failed to stop question: " + data.statusText);
		}
		// Got nothing, connection issue?
		else {
			alert("Error: Failed to stop question. Server connection issue detected, try reloading page?");
		}
	}
}

/**
 * Hides any html that we don't want to see
 * until the user selects that specific
 * question type.
 */
function initHideOtherQTypes() {
	$('#fillInBlankDiv').hide();
	$('#fillInBlankDivHidden').hide();
}

function initializeQuizStyles()
{
	$( "#radio" ).buttonset();
}

/**
 * This function will be called when we receive
 * a response back from the server about
 * saving the question.
 * @data Server response JSON
 * @status If "success", no error occurred
 */
function saveQuestionCallback(data, status) {
	// If we don't get an error back, then process the data
	if (status == "success") {
		var data = data.responseJSON;
		var questionID = data.questionId;
		var title = data.title;
		var version = data.version;

		var questionHTML = '<fieldset class="playBtnGroup"> <img src="./img/play_off.ico" class="img-swap"> <button id="' + questionID + '" class="questionGroup" version="' + version +'">' + title + '</button></fieldset>';
		$("#resultsGroups").append(questionHTML);
		$('.playBtnGroup #' + questionID).button();
	}
	else {
		alert("There was an error saving this question!");
	}
}

/**
 * Called when we receive a response from the server
 * about updating a question.
 * @param data
 * @param status
 */
function updateQuestionCallback(data, status) {
	if (status == "success") {
		console.log("Successfully updated question.");
	}
	else {
		alert("There was an error updating this question!");
	}
}


/**
 * This function will be called when we receive
 * a response back from the server about
 * updating question view.
 * @data Server response JSON
 * @status If "success", no error occurred
 */
function loadQuestionCallback(data, status) {
	// If we don't get an error back, then process the data
	if (status == "success") {
		var result = data.responseJSON;
		var qType = result.type;
		sessionStorage.setItem("currQuestion", result.questionId);
		$('#resultsGroups button#'+result.questionId).closest('.playBtnGroup').css("border-color", "white");

		// MULTIPLE CHOICE
		if (qType == 0) {
			// Select questionType = multiple choice
			// Call .trigger("change") to fire event so proper html is displayed for this qtype
			$('#questionType input[value="0"]').prop('checked', true).trigger("change");
			// Set title text
			$('#questionTitleText').val(result.title);
			// Set question content text
			$('#questionContentText').val(result.content);

			// Remove default blank answers before inserting loaded ones
			$('.questionAnswerBlock').remove();

			// Populate answers
			var answerList = result.options;
			var optionID;
			for (var i=0; i<answerList.length; i++) {
				optionID = answerList[i].optionId;
				var newAnswer = '<div class="questionAnswerBlock"><button type="button" class="deleteAnswerBtn">Delete</button> <input placeholder="Answer" type="text" name="answer"> <span class="correctRadioBtn"><input type="radio" name="ans" value="' + optionID + '">Correct</span></div>';
				$('#questionOptionBox').append(newAnswer);
				var answerText = answerList[i].text;
				$('.questionAnswerBlock input[type="text"]:last').val(answerText);
			}
			$('.questionAnswerBlock button').button();

			// Select correct answer radio button
			var answerToSelect = result.answer;
			$('.questionAnswerBlock input[type="radio"][value="'+answerToSelect+'"]').prop('checked', true);
		}
		// FILL-IN-THE-BLANK
		else if (qType == 1) {
			// Select 'multiple choice' question type
			// Call .trigger("change") to fire event so proper html is displayed for this qtype
			$('#questionType input[value="1"]').prop('checked', true).trigger("change");
			// Set title text
			$('#questionTitleText').val(result.title);
			// Set question content text
			$('#questionContentText').val(result.content);
			$('#fillInBlankDiv input').val(result.answer);
		}
		else {
			alert("Error: Unable to determine question type. UNSUPPORTED.");
		}
	}
	else {
		alert("Error: Could not load question.");
	}
}