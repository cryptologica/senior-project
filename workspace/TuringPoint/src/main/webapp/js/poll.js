/**
 * Initializations
 */
$(document).ready(function() {
	
	// Remove any previously set question id
	sessionStorage.removeItem("currQuestion");
	
	window.currentTab = "edit"
	
	var lectureID = sessionStorage.getItem("lectureID");
	if (lectureID == null)	// Direct to login page if lectureID not set
		loadpage("login");

	// Then load content mce. Once that's loaded, show it and begin loadQuestion sequence.
	initTinyMCE();
	
	window.presentationFontSize = sessionStorage.getItem("presentationFontSize")
	if (window.presentationFontSize == null)
	{
		sessionStorage.setItem("presentationFontSize",3)
		window.presentationFontSize = sessionStorage.getItem("presentationFontSize")
	}
		
	redrawFontSizeButtonsAndPresentationFonts();
	
	if(window.presentationWindow != null)
	{
		window.presentationWindow.$(window.presentationWindow.document).trigger("questionChange");
		window.presentationWindow.$(window.presentationWindow.document).trigger("fontChange");
	}
	
	///init result vis variable
	window.resultVis = null;
	
	// Tooltip Properties on Tabs
	$('[data-toggle="tab"]').tooltip({
	    trigger: 'hover',
	    placement: 'top',
	    animate: true,
	    delay: {show: 1000, hide: 100},
	    container: 'body'
	});
	
	// Init question publish Switch
	$("#publishSwitch").bootstrapSwitch({offColor: 'danger'});
	
	// Init Point Value Number Steppers
	initNumberSpinners()
	
	// Sometimes screen focus is wonky, just scroll to top after initializing
	window.scrollTo(0,0);
	
	//DISABLED PENDING FINISHING FOR QUESTION CREATION
	//createTaggingUI("#taggingUIcontainer");
	
	$('.modal') 
	.on('shown', function(){ 
	  console.log('show'); 
	  $('body').css({overflow: 'hidden'}); 
	}) 
	.on('hidden', function(){ 
	  $('body').css({overflow: ''}); 
	}); 
});

/**
 **	NOTE: Polls page JS methods moved to pollscommon.js so that they can be used on questionbank.js too
 **/


/**
 * Click on import button
 */
$(document).on('click', '#importBtn', function(event) {
	
	$('#mainPageContent').addClass('hidden');
	$('#importPageContent').removeClass('hidden');
	
	loadQuestionBankQuestions();
	loadLectureQuestions();
});

/**
 * Click on import close button
 */
$(document).on('click', '#closeImportBtn', function(event) {
	
	$('#mainPageContent').removeClass('hidden');
	$('#importPageContent').addClass('hidden');
});

function loadLectureQuestions(){
	// See if already saved lectures
	var lectures = JSON.parse(localStorage.getItem("lectures"));
	if(lectures == null){
		
		
		var courseID = sessionStorage.getItem('courseID');
		if(courseID == null)
			loadPage("login");
		
		var baseURL = sessionStorage.getItem("baseURL");
		var url = baseURL + "/courses/" + courseID + "/lectures";

		
		$.getJSON(url, function(data, status){
			var lectures = data.Lectures;
			
			// Store sessions for future use
			localStorage.setItem("lectures", JSON.stringify(lectures));
			processLectures(lectures);
		});
	} else{
		processLectures(lectures);
	}
}

function processLectures(lectures){
	// Check if there are no lectures
	if(lectures.length == 0){
		$('.lecturesList').html("No Lectures");
		return;
	}
	
	var lecturesListHTML = '';
	// Extract info for each course
	for (var i = 0; i < lectures.length; i++) {
		var lectureId = lectures[i].lectureId;
		var lectureName = lectures[i].name;
		
		lecturesListHTML += lectureImportHTML(lectureId, lectureName);
	}
	$('.lecturesList').html(lecturesListHTML);
}

function lectureImportHTML(lectureId, lectureName){
	var lectureHTML = '<div class="panel panel-default lectureImportGroup" lectureid="'+lectureId+'" >'+
	'<div class="panel-heading">'+
		'<h4 class="panel-title">'+
			'<a class="collapsed" aria-expanded="false"'+
				'data-toggle="collapse" data-parent="#accordion"'+
				'href="#collapse'+lectureId+'">'+lectureName+'</a>'+
		'</h4>'+
	'</div>'+
	'<div style="height: 0px;" aria-expanded="false"'+
		'id="collapse'+lectureId+'" class="panel-collapse collapse">'+
		'<div class="panel-body">Test Content</div>'+
	'</div>'+
'</div>';
	return lectureHTML;
}

function loadQuestionBankQuestions(){
	if($('#questionBankToggleBtn').hasClass('closed')){
		$('#questionBankToggleBtn').find('.panel-footer').html('Hide Details <span class="fa fa-angle-up"></span>');
		$('#questionBankToggleBtn').removeClass('closed');
		
		if($('#bankQuestions').html() == ''){	// List of question bank questions not listed
			var courseID = sessionStorage.getItem("courseID");
			var url = sessionStorage.getItem("baseURL") + "/questionbank/course/" + courseID + "/questions";
			$.getJSON(url, function(data, status){
				var questions = data.QS;
				if(questions.length == 0){
					$('#bankQuestions').html('<div class="list-group-item">No Question Bank Questions</div>')
				} else {
					// Extract info for each question
					for (var i = 0; i < questions.length; i++) {
						var questionID = questions[i].questionId;
						var title = questions[i].title;
						var version = questions[i].version;
						
						// Generate and add the HTML buttons to the page
						var buttonHTML = importQuestionButton(questionID, title, true);
						$('#bankQuestions').append(buttonHTML);
					}
				}
			});
		}
	} else {
		$('#questionBankToggleBtn').find('.panel-footer').html('Show Details <span class="fa fa-angle-down"></span>');
		$('#questionBankToggleBtn').addClass('closed');
	}
}

/**
 * Build and return the HTML for a button tile used on the import questions page
 */
function importQuestionButton(questionId, title, isQuestionBank){
	var returnedHTML = '<div class="col-md-6 thumb">'+
							'<div class="thumbnail importBtnGroup" importid="'+questionId+'">'+
								'<h2 class="text-center">'+title+'</h2>'+
								'<div class="importStatus"></div>'+
								'<div class="row">'+
									'<div class="col-md-6 col-sm-6 text-center">'+
										'<button type="button" class="btn btn-outline btn-primary btn-block previewBtn '+(isQuestionBank ? "questionBank":"")+'"><i class="fa fa-search"></i> Preview</button>'+
									'</div>'+
									'<div class="col-md-6 col-sm-6 text-center"">'+
										'<button type="button" class="btn btn-block btn-primary '+(isQuestionBank ? "questionBankImport":"questionImportBtn")+'"><i class="glyphicon glyphicon-download-alt"></i> Import</button>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
	return returnedHTML;
}

/**
 * Click on question preview button
 */
$(document).on('click', '.previewBtn', function(event) {
	
	event.preventDefault();
	
	var questionID = $(this).closest('.importBtnGroup').attr('importid');
	
	var isQuestionBank = $(this).hasClass('questionBank');
	var url = sessionStorage.getItem("baseURL") + "/" + (isQuestionBank ? 'questionbank' : 'question') + "/" + questionID;
	$.ajax({
		  method: "GET",
		  url: url,
		  complete: function(data, status){
			  window.currentQuestionData = data.responseJSON
			  fillInPollPresentationPreviewInfo(false);
			  $("#previewModal").modal("show");
		  }
	});
	return false;
});


/**
 * Click on question preview button
 */
$(document).on('click', '.lectureImportGroup', function(event) {
	
	event.preventDefault();
	
	var lectureId = $(this).attr('lectureid');
	var url = sessionStorage.getItem("baseURL") + "/lecture/" + lectureId;
	
	$.ajax({
		  method: "GET",
		  url: url,
		  complete: function(data, status){
				var questions = data.responseJSON.QS;
				if(questions.length == 0){
					$('#collapse' + lectureId).find('.panel-body').html('<div class="list-group-item">No Question Created For This Lecture.</div>')
				} else {
					
					$('#collapse' + lectureId).find('.panel-body').html('');
					
					// Extract info for each question
					for (var i = 0; i < questions.length; i++) {
						var questionID = questions[i].questionId;
						var title = questions[i].title;
						var version = questions[i].version;
						
						// Generate and add the HTML buttons to the page
						var buttonHTML = importQuestionButton(questionID, title, false);
						$('#collapse' + lectureId).find('.panel-body').append(buttonHTML);
					}
				}
		  }
	});
	return false;
});


/**
 * Click on question import button
 */
$(document).on('click', '.questionImportBtn', function(event) {
	var importQuestionId = $(this).closest('.importBtnGroup').attr('importid');
	questionImport(event, importQuestionId, false);
});

/**
 * Click on question bank import button
 */
$(document).on('click', '.questionBankImport', function(event) {
	var importQuestionId = $(this).closest('.importBtnGroup').attr('importid');
	questionImport(event,importQuestionId, true);
});

function questionImport(event, importQuestionId, isQuestionBank){
	event.preventDefault();
	
	var lectureId = GetURLParameter("lectureId");
	var url = sessionStorage.getItem("baseURL") + "/question/" + lectureId + "/import" + (isQuestionBank ? "qbank" : "") + "/" + importQuestionId;
	
	$.ajax({
		  method: "POST",
		  url: url,
		  complete: saveQuestionCallback
	});
	return false;
}

/**
 * Clicked question bank dropdown toggle button
 */
$(document).on('click', '#questionBankToggleBtn', function(event) {
	if($('#questionBankToggleBtn').hasClass('closed')){
		$('#questionBankToggleBtn').find('.panel-footer').html('Hide Details <span class="fa fa-angle-up"></span>');
		$('#questionBankToggleBtn').removeClass('closed');
	} else {
		$('#questionBankToggleBtn').find('.panel-footer').html('Show Details <span class="fa fa-angle-down"></span>');
		$('#questionBankToggleBtn').addClass('closed');
	}
});