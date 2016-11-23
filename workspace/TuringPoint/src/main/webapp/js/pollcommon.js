

$( window ).on('resize', function(){
	if(window.currentTab == "review")
	{
		//console.log("resize handler")
		redrawResults();
	}
});


$(document).on('click', '#editTab', function(event) {
	//console.log("on Review tab")
	window.currentTab = "edit";	
});

/**
 * Delete question button clicked
 */
$(document).on('click', '#deleteQuestionBtn', function(event) {
	event.stopPropagation();
	var questionTitle = $(this).prev('.title').text().trim();
	var questionID = $(this).closest('.questionBtn').attr('questionid');
	
	// If we delete active question make sure to clear old data in callback
	if ($(this).closest('.questionBtn').hasClass('active')) {
		sessionStorage.setItem("deletedActive", true);
	}
	else {
		sessionStorage.setItem("deletedActive", false);
	}
	
	bootbox.dialog({
		  message: questionTitle + " will be permanently deleted.",
		  title: "Are you sure?",
		  buttons: {
		    danger: {
		      label: "Yes",
		      className: "btn-danger",
		      callback: function() {
		        var userID = sessionStorage.getItem('userID');
		    	var currentPage = getCurrentPageName();
		    	var questionPath = (currentPage == 'questionbank' ? 'questionbank':'question');
				var url = sessionStorage.getItem("baseURL") + "/" + questionPath + "/" + questionID + "/delete";
				var data = JSON.stringify({
						"userId": userID
				});
				$.ajax({
				    type: 'POST',
				    url: 	url,
				    data: data,
				    contentType: "application/json",
				    dataType: 'json',
				    success: function(data, status) {
			    		var questionID = data.questionId;
			    		var questionTitle = $('a[questionid='+ questionID +'] .title').text();
			    		$('li:has("a[questionid='+ questionID +']")').remove();
			    		sessionStorage.removeItem("currQuestion");
			    		
			    		// If there's no questions, add message
			    		if ($('.questionBtn').length == 0){
			    			appendNoQuestionsMessage();
			    		}
			    		var deletedActive = sessionStorage.getItem("deletedActive");
			    		if (deletedActive == "true") {
			    			// Clear old data
				    		$('#newQuestionBtn').click();
			    		}
			    		sessionStorage.setItem("deletedActive", false);
			    		
			    		// Show success message that disappears after 3 seconds
			    		$('#side-menu').find('.alert').remove();
			    		$('#newQuestionBtn').after(generateAlertNonDismiss(questionTitle + ' was successfully deleted.', 'tempAlert', 1));
			    		$('.tempAlert').fadeOut(5000);
			    		setTimeout( function() { $('.tempAlert').remove() }, 5000);
				    },
					error: function(data, status) {
						sessionStorage.setItem("deletedActive", false);
						// Display error msg
						$('#newQuestionBtn').after(generateAlert('Question deletion failed. Please try again.', 4));
						console.log("Error deleting question: " + data.msg);
					}
				});
		      }
		    },
		    main: {
		      label: "No",
		      className: "btn-default",
		      callback: function() {
		        // Do nothing
		      }
		    }
		  }
		});
});

/**
 * Toggle "Show Answer" check-box
 */
$(document).on('click', '#showAnswerCheckbox', function(event) {
	$('.correctRadioBtn').toggle();
	$('#fillInBlankAnswer').toggle();
	$('.correctCheckboxBtn').toggle();
});

/**
 * When user selects a correct answer (MULT-CHOICE)...
 * Update the point values accordingly.
 */
$(document).on('click', 'input[type=radio][name=ans]', function(event) {
	// Get value of previous correct answer (or 1 if no previous)
	var max = 0;
	$($(this).closest('#questionAnswerBlock')).find('.row').each(function(index, object) {
		object = $(object).find('input[name=point_value]')
		if (parseInt(object.val()) > max) {
			max = object.val();
		}
		if (parseInt(object.val()) > 0) {
			object.val("0");
		}
	});

	// Set point value for newly selected correct answer
	$(this).closest('.row').find('input[name=point_value]').val(max);
});

/**
 * When user selects a correct answer (MULT-Answer)...
 * Update the point values accordingly.
 */
$(document).on('click', 'input[type=checkbox][name=ans]', function(event) {
	// Find the max/min point values
	var max = 0;
	var min = 0
	$($(this).closest('#multAnswerBlock')).find('.row').each(function(index, object) {
		object = $(object).find('input[name=point_value]')
		if (parseInt(object.val()) > max) {
			max = parseInt(object.val());
		}
		if (parseInt(object.val()) < min) {
			min = parseInt(object.val());
		}
	});
	
	// Did they check or uncheck a box?
	var isChecked = $(this).is(":checked");
	if (isChecked) {
		$(this).closest('.row').find('input[name=point_value]').val(max);
	}
	else {
		// Unchecked, set points to min
		$(this).closest('.row').find('input[name=point_value]').val(min);
	}
});

/**
 * Click on "Add Option" button (Mult Choice)
 */
$(document).on('click', '#addOptionBtn', function(event) {
	// Append new question option with optionID = -1
	appendQuestionOption("-1", "0");
	$('#addAnswerBtn').blur();
});

/**
 * Click on "Add Option" button (Mult Choice)
 */
$(document).on('click', '#addMultAnswerBtn', function(event) {
	appendMultAnswerOption("-1", "0");
	$('#addMultAnswerBtn').blur();
});

/**
 * Play / Stop button is clicked
 */
$(document).on('click', '.playBtnGroup', function(event) {
	// Don't allow loadQuestion to be triggered
	event.stopPropagation();
	event.stopPropagation();

	var data = new Object();
	var courseID = sessionStorage.getItem("courseID")
	data.courseId = parseInt(courseID);
	var questionID = $(this).parent().attr("questionid");
	
	
	var isPlayBtn = $(this).hasClass("btn-success");	// If currently the play button
	
	var url = sessionStorage.getItem("baseURL") + "/question/" + questionID + (isPlayBtn ? "/start" : "/end");
	console.log(questionID +" : " + isPlayBtn);
	if(isPlayBtn){
		$.ajax({
			  method: "POST",
			  url: url,
			  contentType: "application/json",
			  data: JSON.stringify(data),
			  complete: setQuestionActiveCallback
		});
	} else {
		$.ajax({
			  method: "POST",
			  url: url,
			  contentType: "application/json",
			  data: JSON.stringify(data),
			  complete: setQuestionInactiveCallback
		});
	}
});

/**
 * Click on "Content" tab
 */
$(document).on('click', '#contentTab', function(event) {
	
	tinyMCE.execCommand('mceAddControl', false, 'questionFeedbackText');
	tinyMCE.triggerSave();
	tinyMCE.execCommand('mceFocus', false, 'questionFeedbackText');
	tinyMCE.execCommand('mceRemoveControl', false, 'questionFeedbackText');
	tinyMCE.editors.questionFeedbackText.hide();
	
	tinyMCE.editors.questionContentText.show();
	tinyMCE.execCommand('mceAddControl', false, 'questionContentText');
});

/**
 * Click on "Feedback" tab
 */
$(document).on('click', '#feedbackTab', function(event) {
	
	tinyMCE.execCommand('mceAddControl', false, 'questionContentText');
	tinyMCE.triggerSave();
	tinyMCE.execCommand('mceFocus', false, 'questionContentText');
	tinyMCE.execCommand('mceRemoveControl', false, 'questionContentText');
	tinyMCE.editors.questionContentText.hide();
	
	tinyMCE.editors.questionFeedbackText.show();
	tinyMCE.execCommand('mceAddControl', false, 'questionFeedbackText');
});


/**
 * Initializes the tinyMCE text editor. Call before you want to use it/when you want it to appear on the page.
 * This also loads the questions on the page after it is initialized.
 */
function initTinyMCE() {
	tinymce.init({
				//selector : '#questionContentText',
				//selector : "textarea",
				mode : "textareas",
				height : 242,
				//mode : "none",
				plugins : [
						'advlist autolink lists link charmap print preview anchor',
						'searchreplace visualblocks code fullscreen',
						'insertdatetime table contextmenu paste code',
						'codesample' ],
				toolbar : 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | codesample',
				content_css : [ '../bower_components/prism/prism.css' ],
				
				init_instance_callback : function(inst){
					setTimeout(function(){ $('#contentTab').click(); }, 100);
					fetchQuestionList();
				}
				
			});
	
}

/**
 * Initializes the point value UI elements.
 * Due to dynamic HTML generation, centralizing code to this func.
 */
function initNumberSpinners() {
	// Init Point Value Number Steppers
	$("input[name='point_value']").TouchSpin({
	      verticalbuttons: true,
	      min: -100,
          max: 100,
          step: 1,
          boostat: 5,
          maxboostedstep: 10,
          verticalupclass: 'glyphicon glyphicon-plus',
          verticaldownclass: 'glyphicon glyphicon-minus'
	    });
}

/**
 * Fetch the questions list
 */
function fetchQuestionList(){
	
	if(window.questionLoaded == null){	// Make sure only loaded once
		window.questionLoaded = "loaded";
		
		var lectureID = sessionStorage.getItem("lectureID");
		
		var queryLectureID = $.query.get('lectureId');
		if(queryLectureID != null && queryLectureID != ''){
			lectureID = queryLectureID;
			queryString.push('lectureId', lectureID);
		}

		var courseID = sessionStorage.getItem("courseID");
		var url = sessionStorage.getItem("baseURL") + "/lecture/" + lectureID;
		var currentPage = getCurrentPageName();
		if(currentPage == 'questionbank')
		{
			url = sessionStorage.getItem("baseURL") + "/questionbank/course/" + courseID + "/questions";
		}
		$.getJSON(url, questionListCallback);
	}
}


/**
 * Server response callback for setting a question active.
 */
function setQuestionActiveCallback(data, status) {
	if(status == "success"){
		var questionID = data.responseJSON.questionId;
		displayStopButton(questionID);
		$('[questionid="'+questionID+'"]').find('.playBtnGroup').addClass('active');
		$("#presentTab").click();
	}
}

/**
 * Server response callback for setting a question inactive.
 */
function setQuestionInactiveCallback(data, status) {
	if(status == "success"){
		var questionID = data.responseJSON.questionId;
		displayPlayButton(questionID);
		$('[questionid="'+questionID+'"]').find('.playBtnGroup').removeClass('active');

		// FIXME: Need to actually request and update the review tab before showing it
		
		//Show results view
		$("#reviewTab").click();
		
	}
}

/**
 * Question is clicked (to load a question)
 */
$(document).on('click', '.questionBtn', function(event) {
	
	// If import panel already open then close it
	if(!$('#importPageContent').hasClass('hidden')){
		$('#closeImportBtn').click();
	}
	
	clearFormErrors();	// Clear any existing form errors
	
	// Make other questions inactive
	var questions = $('.questionBtn');
	for (var i=0; i < questions.length; i++) {
		$(questions[i]).removeClass('active');
	}
	// Make the question user selected active
	$(this).addClass("active");		// bootstrap class for making button appear selected
	var questionID = $(this).attr('questionid');
	
	queryString.push('questionId', questionID);	// Add to URL parameter as selected question
	
	//for results
	window.resultQuestionID = questionID;
	console.log("questionID " + window.resultQuestionID + " selected");
	
	var currentPage = getCurrentPageName();
	var url = sessionStorage.getItem("baseURL") + "/" + (currentPage == 'questionbank' ? 'questionbank' : 'question') + "/" + questionID;
	$.ajax({
		  method: "GET",
		  url: url,
		  complete: loadQuestionCallback
	});
});

/**
 * Clear all form errors
 */
function clearFormErrors(){
	$('.alertDiv').remove();	// Clear existing errors displays
	$('#questionTitleText').parent().removeClass('has-error');
	$('#questionContentText').parent().removeClass('has-error');
}

/**
 * New question button clicked
 */
$(document).on('click', '#newQuestionBtn', function(event) {
	
	clearFormErrors();
	
	// Make all questions inactive
	var questions = $('.questionBtn');
	for (var i=0; i < questions.length; i++) {
		$(questions[i]).removeClass('active');
	}
	clearQuestionFields();
	sessionStorage.removeItem("currQuestion");	// Clear any active questions
	$('#editTab').click();	// Switch to edit tab
	$('#multiChoiceBtn').click();	// Reposition to multiple-choice question
	// If we should not show the correct answer(s), hide them
	if (!$('#showAnswerCheckbox').is(":checked")) {
		$('.correctRadioBtn').hide();
		$('#fillInBlankAnswer').hide();
		$('.correctCheckboxBtn').hide();
	}
	
	if (getCurrentPageName() != 'questionbank'){
		// Ensure Question Results are disabled by default
		$("#publishSwitch").bootstrapSwitch('state', false, true);
	}
	
	$(this).blur();
});

/**
 * Callback for fetching all available questions (populating buttons)
 */
function questionListCallback(data, status){
	
	// If we don't get an error back, then process the data
	if (status == "success") {

		//$("#lectureName").text(data.name);	// Populate name of the lecture TODO: Implement

		var questions = data.QS;
		
		//$('#sidebarToggleBtn').removeClass('hidden');
		
		// Start building HTML for sidebar
		var sidebarHTML = 
  '<button class="visible-xs btn btn-primary btn-block" data-toggle="collapse" data-target="#side-menu"><div><label>Toggle Question List</label></div></button>'+
			"<div class=\"navbar-default sidebar\" role=\"navigation\" style=\"margin-top: 16px;\"  >"+
                "<div class=\"sidebar-nav\">"+
                    "<ul class=\"nav in\" id=\"side-menu\">";
		
		// Close HTML tags for sidebarHTML
		sidebarHTML +=
			"   		</ul>"+
	                "</div>"+
	                "<!-- /.sidebar-collapse -->"+
	    			"<br><button type=\"button\" class=\"btn btn-outline btn-primary center-block\" id=\"newQuestionBtn\">New Question</button>"+
	    			'<hr> <div id="publishLectureToolip" style="text-align: center;"> <a data-original-title="Publishing a lecture will allow students to see feedback/results for all questions in this lecture." href="#" data-toggle="tooltip" data-placement="top" title=""> <span class="glyphicon glyphicon-question-sign"></span></a> <label>Lecture Results: </label> </div>'+
	    			"<br><button type=\"button\" class=\"btn btn-outline btn-primary center-block\" id=\"publishLectureBtn\">Publish Lecture</button>"+
	    			"<br><button type=\"button\" class=\"btn btn-outline btn-primary center-block\" id=\"unpublishLectureBtn\">Un-Publish Lecture</button>";
					if(getCurrentPageName() == 'poll')	// Exclude import button from question bank page
						sidebarHTML += "<br><button type=\"button\" class=\"btn btn-outline btn-primary center-block\" id=\"importBtn\"><i class=\"glyphicon glyphicon-download-alt\"></i> Import</button>";
					sidebarHTML += '<div class="row">'+
					'<div class="col-md-12 text-center hidden" id="lectureResultStatus">'+
					'</div>'+
	            "</div>"+
	            "<!-- /.sidebar-collapse -->";
		
		$("#mainNav").append(sidebarHTML);
		
		// Ensure tooltip we just addded is initialized
		$("[data-toggle='tooltip']").tooltip();
		
		// Don't show publish button(s) if we're in Question Bank
		if (getCurrentPageName() == 'questionbank') {
			$('#publishLectureBtn').hide();
			$('#unpublishLectureBtn').hide();
			$("#publishLectureToolip").hide();
		}

		if(questions.length == 0){
			appendNoQuestionsMessage();
		} else {
			// Extract info for each question
			for (var i = 0; i < questions.length; i++) {
				var questionID = questions[i].questionId;
				var title = questions[i].title;
				var version = questions[i].version;
				// Generate and add the HTML to the page

				appendSidebarQuestion(questionID, title, version);
			}
			
			// If user clicked on a specific question before coming to page load that one
			var questionId = sessionStorage.getItem('currQuestion');
			if(questionId != null && $('[questionid="'+questionId+'"]').length){
				queryString.push('questionId', questionId);
				$('[questionid="'+questionId+'"]').click();
			} else {
				
				var questionId = $.query.get('questionId');
				if(questionId != null && questionId != ""){
					$('[questionid="'+questionId+'"]').click();
				} else {
					// Load the first question by default
					$('.questionBtn')[0].click();
				}
			}
		}
		
		// Hide play/stop button until we know they're up-to-date
		$('.playBtnGroup').hide();
		
		var currentPage = getCurrentPageName();
		if(currentPage == 'poll'){	// Don't care to fetch active questions if on question bank
			var courseID = sessionStorage.getItem("courseID");	// Get the active questions
			$.ajax({
				  method: "GET",
				  url: sessionStorage.getItem("baseURL") + "/courses/" + courseID + "/status",
				  complete: updateQuestionStatusesCallback
			});
		}
		

		

	}
	else {
		alert("There was an error retrieving the question list from the server.");
	}
		
};


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
			displayStopButton(questionID);
			
			//var playBtn = $('.questionGroup#'+questionID).closest('.playBtnGroup').find('img')[0];
			//playBtn.src = playBtn.src.replace("_off","_on");
		    //$(playBtn).toggleClass("on");
		}
		$('.playBtnGroup').show();
	}
	else {
		alert("Error loading questions/statuses!");
	}
}

/**
 * Change the display for a questionID play/stop button to to a stop
 * @param questionID
 */
function displayStopButton(questionID){
	var button = $('[questionid="' + questionID + '"]').find('.playBtnGroup');
	$(button).removeClass('btn-circle');
	$(button).addClass('btn-square');
	$(button).removeClass('btn-success');
	$(button).addClass('btn-danger');
	
	var icon = $(button).find('.glyphicon');
	$(icon).removeClass('glyphicon-play');
	$(icon).addClass('glyphicon-stop');
}

/**
 * Change the display for a questionID play/stop button to to a play
 * @param questionID
 */
function displayPlayButton(questionID){
	var button = $('[questionid="' + questionID + '"]').find('.playBtnGroup');
	$(button).removeClass('btn-square');
	$(button).addClass('btn-circle');
	$(button).removeClass('btn-danger');
	$(button).addClass('btn-success');
	
	var icon = $(button).find('.glyphicon');
	$(icon).removeClass('glyphicon-stop');
	$(icon).addClass('glyphicon-play');
}


/**
 * Append a new sidebar button with the provided questionID, title, and version.
 */
function appendSidebarQuestion(questionID, title, version){
	var trimmedTitle = trimText(title, 19);
	var buttonHTML =
		'<li><a class="questionBtn" questionid="' + questionID + '" version="' + version + '" href="#">'+
		  '<button type="button" class="btn btn-success btn-circle playBtnGroup"><i class="glyphicon glyphicon-play"></i>'+
		  '</button>'+
		  '<span data-toggle="tooltip" title="' + title + '" class="title"> '+ trimmedTitle +'</span>'+
		  '<button type="button" id="deleteQuestionBtn" class="btn btn-default btn-circle pull-right"><i class="glyphicon glyphicon-remove"></i>'+
		  '</button>'+
		'</a></li>';
	$("#side-menu").append(buttonHTML);
	
	if(getCurrentPageName() == 'questionbank'){
		$('.playBtnGroup').hide();
	}
}

/**
 * Append a new question option loaded with an optionID.
 * Pass a blank optionID for an empty option id.
 */
function appendQuestionOption(optionID, pointValue){
	var newAnswer = '<div class="row optionRow" optionId="'+ optionID +'">'+
    '<div class="col-md-1">'+
    	'<button type="button" class="btn btn-danger btn-circle deleteAnswerBtn text-right"><i class="fa fa-times"></i></button>'+
    '</div>'+
    '<div class="col-md-7">'+
    	'<input placeholder="Answer" class="titleInputText form-control answerText" type="text" name="answer">'+
    '</div>'+
    '<div class="col-md-2 max-width-100">'+
    	'<span class="correctRadioBtn"><input type="radio" name="ans" value="'+ optionID +'">Correct<br></span>'+
    '</div>'+
    '<div class="col-md-2">'+
		'<input type="text" value="'+ pointValue +'" name="point_value">'+
	'</div>'
'</div>';

$('#questionAnswerBlock').append(newAnswer);	// Inject option

// Init point value steppers
initNumberSpinners();

}

/**
 * Append a new question option loaded with an optionID.
 * Pass a blank optionID for an empty option id.
 */
function appendMultAnswerOption(optionID, pointValue){
	var newAnswer = '<div class="row optionRow" optionId="'+ optionID +'">'+
    '<div class="col-md-1">'+
    	'<button type="button" class="btn btn-danger btn-circle deleteAnswerBtn text-right"><i class="fa fa-times"></i></button>'+
    '</div>'+
    '<div class="col-md-7">'+
    	'<input placeholder="Answer" class="titleInputText form-control answerText" type="text" name="answer">'+
    '</div>'+
    '<div class="col-md-2 max-width-100">'+
    	'<span class="correctCheckboxBtn"><input type="checkbox" name="ans" value="'+ optionID +'">Correct</span>'+
    '</div>'+
    '<div class="col-md-2">'+
		'<input type="text" value="'+ pointValue +'" name="point_value">'+
	'</div>'+
'</div>';

	$('#multAnswerBlock').append(newAnswer);
	
	// Init point value steppers
	initNumberSpinners();
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
		
		console.log(result);
		//need to copy this data out for other purposes
		window.currentQuestionData = result
		fillInPollPresentationInfo(false);
		
		//if(window.presentationWindow != null)
		//	window.presentationWindow.$(window.presentationWindow.document).trigger("questionChange");
		
		var qType = result.type;
		sessionStorage.setItem("currQuestion", result.questionId);
		
		// Make sure no residual data
		clearQuestionFields();

		// Set title text
		$('#questionTitleText').val(result.title);
		
		// Set Content and Feedback Tabs
		// Make sure they're not NULL because tinyMCE freaks out otherwise
		if (result.content)
			tinyMCE.editors.questionContentText.setContent(result.content);
		if (result.feedback)
			tinyMCE.editors.questionFeedbackText.setContent(result.feedback);
		
		// Show appropriate button based on if the question is published or not
		var currentPage = getCurrentPageName();
		if (currentPage == 'poll') {
			if (result.isPublished == true) {
				$("#publishSwitch").bootstrapSwitch('state', true, true);
			}
			else {
				$("#publishSwitch").bootstrapSwitch('state', false, true);
			}
		}
		
		
		// MULTIPLE CHOICE
		if (qType == 0) {
			// Select questionType = multiple choice
			$("#multiChoiceBtn").click();

			// Remove default blank answers before inserting loaded ones
			$('#questionAnswerBlock').empty();

			// Populate answers
			var answerList = result.options;
			var optionID;
			for (var i=0; i<answerList.length; i++) {
				optionID = answerList[i].optionId;
				appendQuestionOption(optionID, answerList[i].pointValue);

				var answerText = answerList[i].text;
				$('div[optionId="' + optionID + '"]').find('.answerText').val(answerText);	// Fill in option value
			}

			// Select correct answer radio button
			var answerToSelect = result.answer;
			$('#questionAnswerBlock input[type="radio"][value="'+answerToSelect+'"]').prop('checked', true);
		}
		// FILL-IN-THE-BLANK
		else if (qType == 1) {
			// Select 'Fill-in-blank' question type
			$("#fillInBlankBtn").click();
			$("#fillInBlankWord").click();
			
			// Fill in the answer
			$('#fillInBlankAnswer').val(result.answer);
			$('#wordPointValue').val(result.pointValue);
		}
		// MULTIPLE ANSWER
		else if (qType == 2) {
			// Select questionType = multiple choice
			$("#multAnswerBtn").click();

			// Remove default blank answers before inserting loaded ones
			$('#multAnswerBlock').empty();

			// Populate answers
			var answerList = result.options;
			var optionID;
			for (var i=0; i < answerList.length; i++) {
				optionID = answerList[i].optionId;
				appendMultAnswerOption(optionID, answerList[i].pointValue);

				var answerText = answerList[i].text;
				$('div[optionId="' + optionID + '"]').find('.answerText').val(answerText);
				
				var correct = answerList[i].correct;
				if (correct == 1) {
					$('#multAnswerBlock input[type="checkbox"][value="'+optionID+'"]').prop('checked', true);
				}
			}
		}
		// Numerical Question Type
		else if (qType == 3) {
			// Select questionType = numerical
			$('#fillInBlankBtn').click();
			$("#fillInBlankNumerical").click();
			
			var answers = result.answer.split(';');
			
			// Fill in the answer
			$('#fillInBlankAnswerNumerical').val(answers[0]);
			$('#fillInBlankAnswerNumericalRange').val(answers[1]);
			$('#numericPointValue').val(result.pointValue);
		}
		else {
			alert("Error: Unable to determine question type. UNSUPPORTED.");
		}
		
		// If we should not show the correct answer(s), hide them
		if (!$('#showAnswerCheckbox').is(":checked")) {
			$('.correctRadioBtn').hide();
			$('#fillInBlankAnswer').hide();
			$('.correctCheckboxBtn').hide();
		}
		
		
		if(window.currentTab == "review")
		{
			$("#reviewTab").click();
		}
		beginResponseFetching();	// Will start fetching the number of responses. Won't fire unless on preview tab.
	}
	else {
		alert("Error: Could not load question.");
	}
}


//When click "Delete" button on question option
$(document).on('click', '.deleteAnswerBtn', function(event) {
	qType = $('#questionType [class="active"]').val();
	// MULTIPLE CHOICE
	if (qType == 0) {
		// Don't let them delete it if it's the only answer
		var numElements = $('#questionAnswerBlock').find('.optionRow').length;
		if (numElements == 1) {
			$('#questionAnswerBlock').after(generateAlert('Each question must have at least one answer option.', 4));
			return;
		}

		// Is 'to-be-deleted' element a correct answer?
		var isChecked = false;
		if ($(this).closest('.row').find('input[type=radio]').is(":checked")) {
			isChecked = true;
		}

		var optionRow = $(event.currentTarget).closest('.optionRow'); 

		// Remove error div if exists
		if( $(optionRow).next('div').hasClass('alertDiv'))
			$(optionRow).next('div').remove();
		
		// Delete the answer
		$(optionRow).remove();

		// Select first answer as correct if they deleted correct answer
		if (isChecked) {
			$('#questionAnswerBlock .correctRadioBtn input:first').prop('checked', true);
		}
	}
	// MULTIPLE ANSWER
	if (qType == 2) {
		var numElements = $('#multAnswerBlock').find('.optionRow').length;
		var optionRow = $(this).closest('.optionRow');
		if (numElements == 1) {
			$('#multAnswerBlock').after(generateAlert('Each question must have at least one answer option.', 4));
			return;
		}
		optionRow.remove();
	}
	
});

/**
 * Instructor clicks "Question Results" Switch on poll page
 */
$(document).on('switchChange.bootstrapSwitch', '#publishSwitch', function(event, state) {
	// Don't change the switch state until we receive a success response from server.
	$(this).bootstrapSwitch('state', !state, true);
	var questionID = sessionStorage.getItem("currQuestion");
	
	// Transition to Results = ON
	if (state == true) {
		var url = sessionStorage.getItem("baseURL") + "/question/" + questionID + "/publish";
		if (!questionID) {
			$("#questionResultStatus").after(generateAlertDismiss('Cannot publish an unsaved question.', 'col-md-10 text-center', 4));
			return;
		}
		// Send request to turn results ON for this question
		$.ajax({
			  method: "POST",
			  url: url,
			  success: function(data, status) {
				  console.log("Publish Question: Successful");
				  $("#publishSwitch").bootstrapSwitch('toggleState', true, true);
			    },
				error: function(data, status) {
					console.log("Publish Question: Failed");
					$("#questionResultStatus").after(generateAlertDismiss('Failed to publish question results. Please try again.', 'col-md-10 text-center', 4));
				}
		});
	}
	// Transition to Results = OFF
	else {
		var url = sessionStorage.getItem("baseURL") + "/question/" + questionID + "/unpublish";
		if (!questionID) {
			console.log("Cannot unpublish an unsaved question.");
			return;
		}
		// Send request to turn results OFF for this question
		$.ajax({
			  method: "POST",
			  url: url,
			  success: function(data, status) {
				  console.log("Un-Publish Question: Successful");
				  $("#publishSwitch").bootstrapSwitch('toggleState', true, true);
			    },
				error: function(data, status) {
					console.log("Un-Publish Question: Failed");
					$("#questionResultStatus").after(generateAlertDismiss('Failed to unpublish question results. Please try again.', 'col-md-10 text-center', 4));
				}// TODO: Publish Question
		});
	}
	
});

/**
 * Instructor clicks "Publish Lecture" on poll page
 */
$(document).on('click', '#publishLectureBtn', function(event) {
	$(this).blur();
	var lectureID = sessionStorage.getItem("lectureID")
	var url = sessionStorage.getItem("baseURL") + "/lecture/" + lectureID + "/publish";
	
	$.ajax({
		  method: "POST",
		  url: url,
		  success: function(data, status) {
			  console.log("Publish Lecture: Successful");
			  // Ensure publish question buttons on current question are 
			  // updated to reflect the change without reloading question.
			  var questionID = sessionStorage.getItem("currQuestion");
			  if (questionID) {
				  $("#publishSwitch").bootstrapSwitch('state', true, true);
			  }
			  displayAlertWithTimeout('#lectureResultStatus', generateAlertNonDismiss('Lecture Published!', '', 1), 3000);
		    },
			error: function(data, status) {
				console.log("Publish Lecture: Failed");
				$("#lectureResultStatus").after(generateAlertDismiss('Failed to publish lecture.', 'col-md-12 text-center', 4));
			}
	});
});

/**
 * Instructor clicks "Un-Publish Lecture" on poll page
 */
$(document).on('click', '#unpublishLectureBtn', function(event) {
	$(this).blur();
	var lectureID = sessionStorage.getItem("lectureID")
	var url = sessionStorage.getItem("baseURL") + "/lecture/" + lectureID + "/unpublish";
	
	$.ajax({
		  method: "POST",
		  url: url,
		  success: function(data, status) {
			  console.log("Un-Publish Lecture: Successful");
			  // Ensure publish question buttons on current question are 
			  // updated to reflect the change without reloading question.
			  var questionID = sessionStorage.getItem("currQuestion");
			  if (questionID) {
				  $("#publishSwitch").bootstrapSwitch('state', false, true);
			  }
			  displayAlertWithTimeout('#lectureResultStatus', generateAlertNonDismiss('Lecture Un-Published!', '', 1), 3000);
		    },
			error: function(data, status) {
				console.log("Un-Publish Lecture: Failed");
				$("#lectureResultStatus").after(generateAlertDismiss('Failed to un-publish lecture.', 'col-md-12 text-center', 4));
			}
	});
});

/**
 * Instructor clicks "Save Question" on poll management page
 */
$(document).on('click', '#saveBtn', function(event) {
	$(this).blur();
	
	$('.alertDiv').remove();	// Clear existing error displays
	
	var data = new Object();
	data.type = parseInt($('#questionType [class="active"]').val());
	var shouldUpdate = false;
	var currQuestion = sessionStorage.getItem("currQuestion");
	if (currQuestion != "null" && currQuestion != undefined && currQuestion != null) {
		shouldUpdate = true;
	}
	
	var exit = false;	// If should exit (invalid form)
	data.title = $('#questionTitleText').val().trim();
	
	// Get Content and Feedback from tinyMCE
	data.content = tinyMCE.editors.questionContentText.getContent();
	data.feedback = tinyMCE.editors.questionFeedbackText.getContent();
	
	if(data.title.length > 150){
		exit = true;	// Not valid
		$('#questionTitleText').parent().addClass("has-error");	// Makes input red
		$('#questionTitleText').parent().after(generateAlertNonDismiss('Title cannot be longer than 150 characters, using ' + data.title.length + '/150 characters.', 'col-md-10 row', 4));
	} else if (data.title == "") {
		exit = true;	// Not valid
		$('#questionTitleText').parent().addClass("has-error");	// Makes input red
		$('#questionTitleText').parent().after(generateAlertNonDismiss('Title cannot be empty.', 'col-md-10 row', 4));
	} else {
		$('#questionTitleText').parent().removeClass('has-error');
	}
	
	if(data.content.length > 1000){
		exit = true;	// Not valid
		$('#contentTab').click(); // Make sure we're on the Content Tab
		$('#questionContentText').parent().addClass("has-error");	// Makes input red
		$('#questionContentText').parent().after(generateAlertNonDismiss('Content cannot be longer than 1000 characters, using ' + data.content.length + '/1000 characters.', 'col-md-10 row', 4));
	} else if (data.content == "") {
		exit = true;	// Not valid
		$('#contentTab').click(); // Make sure we're on the Content Tab
		$('#questionContentText').parent().addClass("has-error");	// Makes input red
		$('#questionContentText').parent().after(generateAlertNonDismiss('Question content cannot be empty.', 'col-md-10 row', 4));
	} else {
		$('#questionContentText').parent().removeClass("has-error");
	}
	
	var courseID = sessionStorage.getItem("courseID");	// Sent in request

	// MULTIPLE CHOICE
	if (data.type == 0) {
		
		clearOtherQuestionTypeAnswers(0);

		data.value = parseInt("1");
		data.group = parseInt("-1");
		data.lectureId = parseInt(sessionStorage.getItem("lectureID"));
		data.options = [];
		data.courseId = parseInt(courseID);
		var numAnswers = 0;
		var checkedAnswer = -1;


		$('#questionAnswerBlock').find('.optionRow').each(function(index, object) {
			
			var answer = new Object();
			
			numAnswers++;
			answer.text = $(object).find('.titleInputText').val();
			
			if (answer.text == "") {
				$(object).addClass("has-error");	// Makes input red
				$(object).after(generateAlertNonDismiss('Option value cannot be blank. Either fill in a value or delete the option.', 'col-md-12', 4));
				exit = true;
			} else  if (answer.text.length > 150) {
				$(object).addClass("has-error");	// Makes input red
				$(object).after(generateAlertNonDismiss('Option content cannot be longer than 150 characters, using ' + answer.text.length + '/150 characters.', 'col-md-12', 4));
				exit = true;
			} else {
				$(object).removeClass("has-error");
			}
			if (shouldUpdate) {
				answer.optionId = parseInt($(object).attr('optionId'));
			}
			answer.pointValue = parseInt($(object).find('input[name=point_value]').val());
			data.options.push(answer);
			if ($(object).find('input[type="radio"]').is(':checked')) {
				checkedAnswer = numAnswers;
			}
		});

		if (checkedAnswer <= 0) {
			alert("You must select one question as 'correct'!");
			displayAlertWithTimeout('#saveStatus', generateAlertNonDismiss("You must select one question as 'correct'!", '', 4), 6000);
			return;	// Nothing important below
		}
		if (numAnswers <= 0) {
			//alert("You must have at least one answer per question!");
			displayAlertWithTimeout('#saveStatus', generateAlertNonDismiss('You must have at least one answer per question!', '', 4), 6000);
			return;	// Nothing important below
			
			// Do we want below?
			//exit = true;
			//$('#questionAnswerBlock').after(generateAlert('Each question must have at least one answer option.', 4));
		}
		// Set <option index>
		data.answer = parseInt(checkedAnswer - 1);
	}
	// FILL-IN-THE-BLANK
	else if (data.type == 1) {
		
		// Either FILL-IN-THE-BLANK or Numerical
		data.type = parseInt($('#fillInBlankSelector [class="active"]').val());
		
		clearOtherQuestionTypeAnswers(1);
		
		data.value = parseInt("1");
		data.group = parseInt("-1");
		data.courseId = parseInt(courseID);
		data.lectureId = parseInt(sessionStorage.getItem("lectureID"));
		
		if (data.type == 1) {
			data.answer = $('#fillInBlankAnswer').val();
			data.pointValue = $('#wordPointValue').val();
		}
		else if (data.type == 3) {
			data.answer = $('#fillInBlankAnswerNumerical').val();
			data.pointValue = $('#numericPointValue').val();
			
			if(!$.isNumeric(data.answer)){
				$('#fillInBlankAnswerNumerical').parent().addClass("has-error");	// Makes input red
				$('#fillInBlankAnswerNumerical').after(generateAlertNonDismiss('Answer must be a valid number.', "col-md-12", 4));
				exit = true;
			}
			
			var range = $('#fillInBlankAnswerNumericalRange').val();
			if(range == ""){
				$('#fillInBlankAnswerNumericalRange').parent().addClass("has-error");	// Makes input red
				$('#fillInBlankAnswerNumericalRange').after(generateAlertNonDismiss('Range value cannot be blank.', "col-md-12", 4));
				exit = true;
			}
			else if(!$.isNumeric(range)){
				$('#fillInBlankAnswerNumericalRange').parent().addClass("has-error");	// Makes input red
				$('#fillInBlankAnswerNumericalRange').after(generateAlertNonDismiss('Range must be a valid number.', "col-md-12", 4));
				exit = true;
			}
			data.answer += ';' + range;	// Append range to response
		}
		else{
			alert("Error: Unsupported question type!");
			return;
		}

		var answerSelector = '#fillInBlankAnswer' + (data.type == 3 ? "Numerical" : "");
		var errorWidth = (data.type == 3 ? "col-md-12" : "col-md-9");
		// .parent()
		if (data.answer == "") {
			$(answerSelector).parent().addClass("has-error");	// Makes input red
			$(answerSelector).after(generateAlertNonDismiss('Answer value cannot be blank.', errorWidth, 4));
			exit = true;
		} else  if (data.answer.length > 100) {
			$(answerSelector).parent().addClass("has-error");	// Makes input red
			$(answerSelector).after(generateAlertNonDismiss('Answer cannot be longer than 100 characters, using ' + data.answer.length + '/100 characters.', errorWidth, 4));
			exit = true;
		} else {
			$(answerSelector).removeClass("has-error");
		}
	}
	// MULTIPLE ANSWER
	else if (data.type == 2) {
		clearOtherQuestionTypeAnswers(2);

		data.value = parseInt("1");
		data.group = parseInt("-1");
		data.lectureId = parseInt(sessionStorage.getItem("lectureID"));
		data.options = [];
		data.courseId = parseInt(courseID);
		var numAnswers = 0;

		$('#multAnswerBlock').find('.optionRow').each(function(index, object) {
			
			var answer = new Object();
			
			numAnswers++;
			answer.text = $(object).find('.titleInputText').val();
			
			var isCorrect = $(object).find('input[type="checkbox"]').is(':checked');
			if (isCorrect) {
				answer.correct = 1;
			}
			else {
				answer.correct = 0;
			}
			
			if (answer.text == "") {
				$(object).addClass("has-error");	// Makes input red
				$(object).after(generateAlertNonDismiss('Option value cannot be blank. Either fill in a value or delete the option.', 'col-md-12', 4));
				exit = true;
			} 
			else  if (answer.text.length > 100) {
				$(object).addClass("has-error");	// Makes input red
				$(object).after(generateAlertNonDismiss('Option content cannot be longer than 100 characters, using ' + answer.text.length + '/100 characters.', 'col-md-12', 4));
				exit = true;
			} 
			else {
				$(object).removeClass("has-error");
			}
			
			if (shouldUpdate) {
				answer.optionId = parseInt($(object).attr('optionId'));
			}

			answer.pointValue = parseInt($(object).find('input[name=point_value]').val());
			data.options.push(answer);
			
		});

		if (numAnswers <= 0) {
			exit = true;
			$('#multAnswerBlock').after(generateAlert('Each question must have at least one answer option.', 4));
		}
	}
	// UNSUPPORTED
	else {
		alert("Error: Unsupported question type!");
		return;
	}
	
	// Don't submit data yet?
	if (exit) {
		displayAlertWithTimeout('#saveStatus', generateAlertNonDismiss('Errors on form, see alerts above.', '', 4), 6000);
		return;
	}
	
	var currentPage = getCurrentPageName();
	var questionPath = (currentPage == 'questionbank' ? 'questionbank':'question');

	// UPDATE
	if (shouldUpdate) {
		var questionID = sessionStorage.getItem("currQuestion");
		var url = sessionStorage.getItem("baseURL") + "/"+ questionPath + "/" + questionID + "/update";
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
		
		var url = sessionStorage.getItem("baseURL") + "/" + questionPath + "/create";
		$.ajax({
			  method: "POST",
			  url: url,
			  contentType: "application/json",
			  data: JSON.stringify(data),
			  complete: saveQuestionCallback
		});
	}
	
	//call the greatest function known to man
	ConvertExistingQuestionGutsIntoPresentableObject(data)
	
});


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
		var type = data.type;
		var optionIDs = data.optionIds;
		
		$('#noQuestionsWell').remove();
		
		appendSidebarQuestion(questionID, title, version);	// Add to sidebar questions
		
		updateOptionIDs(type, optionIDs);
		
		sessionStorage.setItem("currQuestion", questionID);	// Set as active question
		$('a[questionid='+questionID+']').addClass('active');
		
		// Scroll to newly added item
		$('#side-menu').animate({
            scrollTop: $('a[questionid='+questionID+']').offset().top
        }, 2000)
		
		displayAlertWithTimeout('#saveStatus', generateAlertNonDismiss('Saved', '', 1), 3000);
		
		// If import panel already open then display import success on appropriate button
		if(!$('#importPageContent').hasClass('hidden')){
			var button = $('[importid="'+data.originalQuestionId+'"]').find('.questionBankImport');
			if(!$(button).length)	// If non-question-bank button
				button = $('[importid="'+data.originalQuestionId+'"]').find('.questionImportBtn');
			var alertHTML = '<i class="fa fa-check"></i> Imported';
			$(button).removeClass('btn-primary');
			$(button).addClass('btn-success');
			if($(button).hasClass('questionImportBtn'))
				$(button).removeClass('questionImportBtn');
			if($(button).hasClass('questionBankImport'))
				$(button).removeClass('questionBankImport');
			$(button).addClass('disabled');
			$(button).html(alertHTML);
		}
	}
	else {
		$('#saveStatus').after('<div class="col-md-10 text-center">'
				+'<div class="alert alert-danger">'
				+'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
				+'Save Failed</div> </div>');
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
		
		//console.log(data);
		var values = data.responseJSON;
		var type = values.type;
		var optionIDs = values.optionIds;
		var questionID = values.questionID;
		
		$('[questionid="' + values.questionID + '"]').find('.title').text( " " + trimText(values.title, 19) );	// Update question title
		updateOptionIDs(type, optionIDs);
		
		displayAlertWithTimeout('#saveStatus', generateAlertNonDismiss('Saved', '', 1), 3000);
		
		if(getCurrentPageName() != 'questionbank'){	// Don't call on question bank, this will cause no-nos
			// A hack to fix one of the polls page tabs rendering
			var url = sessionStorage.getItem("baseURL") + "/question/" + questionID;
			$.ajax({
				  method: "GET",
				  url: url,
				  complete: loadQuestionCallback
			});
		}
	}
	else {
		$('#saveStatus').after('<div class="col-md-10 text-center">'
				+'<div class="alert alert-danger">'
				+'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
				+'Save Failed</div> </div>');
	}
	
	
}

/**
 * Call when you want to load in a new question.
 * Clears all the fields. Prevents residual data when loading new question.
 */
function clearQuestionFields() {
	$('#questionTitleText').val('');

	// Clear Content and Feedback Tabs
	
	if(tinymce.editors.questionContentText != null)
		tinymce.editors.questionContentText.setContent("");
	if(tinymce.editors.questionFeedbackText != null)
		tinymce.editors.questionFeedbackText.setContent("");
	
	$('#fillInBlankAnswer').val('');
	
	clearOtherQuestionTypeAnswers(-1); // Clears all question types (-1)
}


///////////////////////////////////////////////////////////////////////////////////////
/////////////////Presentation tab//////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

$(document).on('click', '#presentTab', function(event) {
	window.currentTab = "present";
	fillInPollPresentationInfo(false,null);
	beginResponseFetching();
});

/**
 * Start fetching the number of responses
 */
function beginResponseFetching(){
	$('#responseCount').addClass('hidden');
	
	clearTimeout(window.responseTimeout);	// Clear any existing timeouts for response fetching
	
	var studentCount = sessionStorage.getItem("studentCount");
	if(studentCount != null){	// If already know how many students
		getResponseCount();
	} else {	// Need to determine how many students there are in the course
		var courseId = sessionStorage.getItem("courseID");
		var url = sessionStorage.getItem("baseURL") + "/courses/" + courseId + "/studentcount";
		$.ajax({
		    type: 'GET',
		    url: 	url,
		    contentType: "application/json",
		    dataType: 'json',
		    success: function(data, status) {
		    	sessionStorage.setItem("studentCount", data.count);
		    	getResponseCount();
		    },
			error: function(data, status) {
				console.log("Error getting count of students for course.");
			}
		});
	}
}

/**
 * Performs a request to get the number of question responses.
 * Does not fire unless on the present tab.
 */
function getResponseCount(){
	var isQuestionOpen = $('.questionBtn.active').find('.playBtnGroup').hasClass('btn-danger');
	var responsesHidden = $('#responseCount').hasClass('hidden');
	// If the present tab is still being viewed, and Q active
	if(responsesHidden || ( $('#presentTab').parent().hasClass('active') && isQuestionOpen )){
		var questionId = $('.questionBtn.active').attr('questionid');
		var url = sessionStorage.getItem("baseURL") + "/results/" + questionId + "/responsecount";
		console.log("About to fetch the response count.");
		$.ajax({
		    type: 'GET',
		    url: 	url,
		    contentType: "application/json",
		    dataType: 'json',
		    success: function(data, status) {
		    	var responseCount = data.count;
		    	window.responseCount = responseCount;
		    	$('#responseCount').removeClass('hidden');
		    	$('#responseNum').text(responseCount);
		    	
		    	var numStudents = sessionStorage.getItem("studentCount");
		    	// Edge Case: If there are more responses than students then more students joined the course recently,
		    	// Need to re-fetch the number of students in this case.
		    	if(responseCount > numStudents){
		    		sessionStorage.removeItem("studentCount");
		    		beginResponseFetching();		// Restart fetching process
		    	} else {
			    	var responsePercent = Math.floor( (responseCount / numStudents) * 100 );
			    	$('#responseBar').css('width', responsePercent + "%");
			    	$('#responseBar').text(responseCount + " / " + numStudents + " Students");
			    	
			    	window.responseTimeout = setTimeout(getResponseCount, 4000);	// Check again in 4 seconds
		    	}
		    },
			error: function(data, status) {
				console.log("Error getting count of students for course.");
			}
		});
	}
}

/**
 * Clicking the minus font
 */
$(document).on('click', '#minusFont', function(event) {


	if(window.presentationFontSize > 0)
	{
		var size = sessionStorage.getItem("presentationFontSize")
		var newSize = (+size) - (+1);
			
		sessionStorage.setItem("presentationFontSize",newSize)
		
		window.presentationFontSize = sessionStorage.getItem("presentationFontSize")

		redrawFontSizeButtonsAndPresentationFonts();
	}
	
	if(window.presentationFontSize > 0)
	{
		$('#minusFont').show();
	}
	else if(window.presentationFontSize == 0)
	{
		$('#minusFont').hide();
	}
	
	if(window.presentationFontSize < 6)
	{
		$('#plusFont').show();
	}
	else if(window.presentationFontSize == 6)
	{
		$('#plusFont').hide();
	}

});

/**
 * Clicking the plus font
 */
$(document).on('click', '#plusFont', function(event) {

	if(window.presentationFontSize < 6)
	{
		var size = sessionStorage.getItem("presentationFontSize")
		var newSize = (+size) + (+1);
			
		sessionStorage.setItem("presentationFontSize",newSize)
		
		window.presentationFontSize = sessionStorage.getItem("presentationFontSize")
		
		redrawFontSizeButtonsAndPresentationFonts();
	}
	
	if(window.presentationFontSize > 0)
	{
		$('#minusFont').show();
	}
	else if(window.presentationFontSize == 0)
	{
		$('#minusFont').hide();
	}
	
	if(window.presentationFontSize < 6)
	{
		$('#plusFont').show();
	}
	else if(window.presentationFontSize == 6)
	{
		$('#plusFont').hide();
	}
	
});

$(document).on('click', '#presentationModeBtn', function(event) {
	window.presentationWindow = window.open("presentation.html", 'Turing Point - Presentation Mode');
});

///////////////////////////////////////////////////////////////////////////////////////
/////////////////Review tab////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Toggle "Show Answer" check-box
 */
$(document).on('click', '#reviewTab', function(event) {
	//console.log("on Review tab")
	window.currentTab = "review"
	window.shownQuestionID = window.resultQuestionID
	selectQuestion(window.resultQuestionID);
	$(window).trigger('resize');
});

/**
 * Clicking the refresh answers button
 */
$(document).on('click', '#refreshResultsBtn', function(event) {
	window.currentTab = "review"
	window.shownQuestionID = window.resultQuestionID
	selectQuestion(window.resultQuestionID)
	$(window).trigger('resize');
});

/**
 * Clears HTML data entered for question types other than the given type.
 * Does not clear the "Title" or "Content".
 * @type -1 -  Clears all types.
 * 		 0  -  Multiple Choice
 * 		 1  -  Fill-In-Blank
 * 		 2  -  Multiple Answer
 */
function clearOtherQuestionTypeAnswers(type) {
	// Multiple Choice
	if (type != 0) {
		$('#questionAnswerBlock').empty(); // Clear all options
		for (var i=0; i<4; i++)	{
			appendQuestionOption("-1", "0"); // Append 4 empty options
		}
		$('.correctRadioBtn input[type="radio"]:first').prop("checked", false); // Check first answer as correct
	}
	// Fill-In-Blank
	if (type != 1) {
		$('#fillInBlankAnswer').val('');
		$('#wordPointValue').val('1');
		
		$('#fillInBlankAnswerNumerical').val('');
		$('#fillInBlankAnswerNumericalRange').val('');
		$('#numericPointValue').val('1');
	}
	// Multiple Answer
	if (type != 2) {
		$('#multAnswerBlock').empty();
		for (var i=0; i<4; i++)	{
			appendMultAnswerOption("-1", "0");
		}
	}
}

/**
 * Places a message in sidebar telling the user that there are no questions.
 */
function appendNoQuestionsMessage() {
	var noQuestionsHTML = '<div class="well well-lg" id="noQuestionsWell">No questions for this course, create one by filling out the questions form.</div>'
	$("#side-menu").append(noQuestionsHTML);
}

/**
 * Updates the optionIds.
 * Call after you create a new question or update a question so the optionIds stay up-to-date.
 * @param type
 * @param optionIDs
 */
function updateOptionIDs(type, optionIDs) {
	// MULTIPLE CHOICE
	if (type == 0) {
		 $('#questionAnswerBlock').find('.optionRow').each(function(index, object) {
			 $(object).attr('optionid', optionIDs[index]);
			 $(object).find('.correctRadioBtn input[type="radio"]').val(optionIDs[index]);
		 });
	}
	// FILL-IN-THE-BLANK
	else if (type == 1) {
		
	}
	// MULTIPLE ANSWER
	else if (type == 2) {
		$('#multAnswerBlock').find('.optionRow').each(function(index, object) {
			$(object).attr('optionid', optionIDs[index]);
			$(object).find('.correctCheckboxBtn input[type="checkbox"]').val(optionIDs[index]);
		 });
	}
	// UNSUPPORTED
	else {
		
	}
}


/////////////////////////////////////////////////////////////////////////////////////////////
//tony's helper corner
/////////////////////////////////////////////////////////////////////////////////////////////
function ConvertExistingQuestionGutsIntoPresentableObject(data)
{
	window.currentQuestionData = data
	fillInPollPresentationInfo(false);
}
/////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Prevent reloading page when a tooltip is clicked
 */
$(document).on('click', '[data-toggle="tooltip"]', function(event) {
	event.preventDefault();
});