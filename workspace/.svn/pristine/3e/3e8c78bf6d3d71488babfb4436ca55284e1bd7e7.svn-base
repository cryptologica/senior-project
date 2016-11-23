$(document).ready(function() {
	
	var role = sessionStorage.getItem('role');
	var courseID = sessionStorage.getItem('courseID');
	
	if(courseID == null)
		loadPage("login");
	
	queryString.push('courseId', courseID);
	
	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/courses/" + courseID + "/lectures";


	// Ask the server for a list of courses available for current user
	$.getJSON(url, lectureListCallback);
});

/**
 * Clicked "New Lecture" button
 */
$(document).on('click', '#addLecture', function(event) {
	$('#resetForm').click();	// Reset the form
	$('#formError').empty();	// Clear any existing errors
});

/**
 * Clicked question bank dropdown toggle button
 */
$(document).on('click', '#questionBankToggleBtn', function(event) {
	if($('#questionBankToggleBtn').hasClass('closed')){
		$('#questionBankToggleBtn').find('.panel-footer').html('Hide Details <span class="fa fa-angle-up"></span>');
		$('#questionBankToggleBtn').removeClass('closed');
		
		var courseID = sessionStorage.getItem("courseID");
		var urlBase = sessionStorage.getItem("baseURL") + "/questionbank/course/" + courseID;
		
		if($('#bankQuestions').html() == ''){	// List of question bank questions not listed
			var url = urlBase + "/questions";
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
						$('#bankQuestions').append('<div class="list-group-item questionBankQuestion" questionbankid="'+questionID+'">'+title+'</div>')
					}
				}
			});
		}
		
		var url = urlBase + "/mostimportedquestions";
		$.getJSON(url, function(data, status){
			$('#bankQuestionsFrequent').html('');	// Clear existing
			var questions = data.QS;
			if(questions.length == 0){
				$('#bankQuestionsFrequent').html('<div class="list-group-item">No Question Bank Questions</div>')
			} else {
				// Extract info for each question
				for (var i = 0; i < questions.length; i++) {
					var questionID = questions[i].questionId;
					var title = questions[i].title;
					var version = questions[i].version;
					
					// Generate and add the HTML buttons to the page
					$('#bankQuestionsFrequent').append('<div class="list-group-item questionBankQuestion" questionbankid="'+questionID+'">'+title+
							'<span class="badge">' + version + '</span></div>');
				}
			}
		});
		
		
	} else {
		$('#questionBankToggleBtn').find('.panel-footer').html('Show Details <span class="fa fa-angle-down"></span>');
		$('#questionBankToggleBtn').addClass('closed');
	}
});

/**
 * Clicked question bank main button
 */
$(document).on('click', '#questionBankBtn', function(event) {
	loadPage("questionbank");
});

/**
 * Clicked question bank question button
 */
$(document).on('click', '.questionBankQuestion', function(event) {
	loadPageParams("questionbank", "questionId=" + $(this).attr('questionbankid'));
});

/**
 * Clicked "Edit" lecture button
 */
$(document).on('click', '#editLecturesBtn', function(event) {
	if( $('#editModeAlert').hasClass('hidden') ){
		$('#editLecturesBtn').text('Disable Edit Mode');
		$('#editModeAlert').removeClass('hidden');	// Show edit mode alert
		$('[id]').addClass('editLecture');	// Add class so that lectures can be edited when clicked
	} else {
		$('#editLecturesBtn').text('Edit');
		$('#editModeAlert').addClass('hidden');
		$('[id]').removeClass('editLecture');
	}
});

/**
 * Instructor - Manage lecture button pressed
 */
$(document).on('click', '.lectureBtn', function(event) {
	var lectureID = $(this).closest('.lecture-tile').attr('id');
	var lectureName = $(this).find('.lectureNameTxt').text();
	sessionStorage.setItem("lectureID", lectureID);
	sessionStorage.setItem("lectureName", lectureName);
	
	// If in edit mode
	if( $(this).closest('.lecture-tile').hasClass('editLecture') ){
		$('#lectureUpdateNameInput').attr('lectureid', lectureID);
		$('#lectureUpdateNameInput').val(lectureName);	// Fill in lecture name in modal
		$('#updateModal').modal('show');
	} else {
		loadPage("poll");	// Load the polls page
	}
});


/**
 * Click "Submit" button on update lecture modal form
 */
$(document).on('click', '#formUpdateSubmit', function(event) {
	event.preventDefault();
	
	var valid = true;
	var lectureName = $('#lectureUpdateNameInput').val().trim();
	// Make sure something was entered
	if (lectureName.length <= 0) {
		valid = false;
		$('#formUpdateError').html( generateAlert("The lecture name cannot be empty.", 3) );
	}
	if (lectureName.length > 45) {
		valid = false;
		$('#formUpdateError').html( generateAlert("Lecture name cannot exceeded 45 character, using " + lectureName.length + "/45 characters." , 4) );
	}
	if (valid) {
		var lectureId = $('#lectureUpdateNameInput').attr('lectureid');	// Selected course
		var name = $('#lectureUpdateNameInput').val();
		var userID = sessionStorage.getItem("userID").toString();
		var url = sessionStorage.getItem("baseURL") + "/lecture/" + lectureId + "/update";
		var data = JSON.stringify({
				"name": name,
				"userId": userID,
		});
		$.ajax({
		    type: 'PUT',
		    url: 	url,
		    data: data,
		    contentType: "application/json",
		    dataType: 'json',
		    success: function(data, status){
		    	// If we don't get an error back, then process the data
		    	if (status == "success") {
			    	$("#updateModal").modal("hide");

			    	$('#'+ lectureId +' .lectureNameTxt').text(name);	// Update lecture
		    		
		    		var lecture = new Object();
		    		lecture.lectureId = lectureId;
		    		lecture.name = name;
		    		
		    		updateLectureInStorage(lecture);
		    	}
		    	else {
		    		alert("There was an error adding the course.");
		    	}
		    }
		});
	}
});

/**
 * Delete lecture button clicked
 */
$(document).on('click', '#deleteLectureBtn', function(event) {
	var lectureID = $("#lectureUpdateNameInput").attr('lectureId');
	
	bootbox.dialog({
		  message: "Deleting a lecture will delete all questions and results in the lecture, and cannot be undone.",
		  title: "Are you sure?",
		  buttons: {
		    danger: {
		      label: "Yes",
		      className: "btn-danger",
		      callback: function() {
		        var userID = sessionStorage.getItem('userID');
				var url = sessionStorage.getItem("baseURL") + "/lecture/" + lectureID;
				var data = JSON.stringify({
						"userId": userID
				});
				$.ajax({
				    type: 'DELETE',
				    url: 	url,
				    data: data,
				    contentType: "application/json",
				    dataType: 'json',
				    success: function(data, status){
				    	// If we don't get an error back, then process the data
				    	if (status == "success") {
					    	//$("#updateModal").modal("hide");
				    		
				    		// Extract the courseId
				    		var courseID = lectureID;

				    		$('#'+ lectureID).remove();	// Update course dropdown
				    		
				    		removeLectureFromStorage(lectureID);
				    		if(getLecturesLength() == 0){	// If no more lectures
				    			appendNoLectureMessage();
				    			$('#editLecturesBtn').click();	// Turn off edit mode, nothing left to edit
				    		}
				    	}
				    	else {
				    		alert("There was an error adding the course.");
				    	}
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
 * Got the list of lectures back from the server
 */
function lectureListCallback(data, status){
	if(status == "success"){
		var lectures = data.Lectures;
		
		// Store sessions for future use
		localStorage.setItem("lectures", JSON.stringify(lectures));
		
		// Check if there are no lectures
		if(lectures.length == 0){
			appendNoLectureMessage();
			return;
		}
		
		// Generate and add the HTML to the page
		var lecturesHTML = 
						 '<!-- /.row -->'+
						 '<div class="row" id="pollsBtns">';
		
		// Extract info for each course
		for (var i = 0; i < lectures.length; i++) {
			var lectureID = lectures[i].lectureId;
			var lectureName = lectures[i].name;
			
			lecturesHTML += getPollButtonHTML(lectureID, lectureName);
		}
		lecturesHTML += '</div>';		// Close off outer row
		$("#lectures").append(lecturesHTML);
		
		// Get questions and set publish status for each lecture
		for (var i = 0; i < lectures.length; i++) {
			var lectureID = lectures[i].lectureId;
			$.ajax({
				  method: "GET",
				  url: sessionStorage.getItem("baseURL") + "/lecture/" + lectureID,
				  complete: updatePublishStatus
			});
		}
		
		// Make each lecture button the same height
		var heights = $(".lectureBtn").map(function() {
	        return $(this).height();
	    }).get(),
	    maxHeight = Math.max.apply(null, heights);
	    $(".lectureBtn").height(maxHeight);
	
		var courseID = sessionStorage.getItem("courseID");	// Get the active questions
		$.ajax({
			  method: "GET",
			  url: sessionStorage.getItem("baseURL") + "/courses/" + courseID + "/status",
			  complete: updateNumOpenQuestions
		});
	}
}

function appendNoLectureMessage(){
	var noLecturesHTML = 
		'<div class="jumbotron" id="noLectures">'+
			'<h1>No Lectures For This Course</h1>'+
			'<p>Create one by clicking the button below.</p>'+
		'</div>';
	$("#lectures").append(noLecturesHTML);
}

/**
 * Get the HTML text for the button used to manage a poll
 */
function getPollButtonHTML(lectureID, lectureName){
	var returnString =
        '<div class="col-lg-3 col-md-4 col-xs-12 lecture-tile" id="' + lectureID + '">'+
            '<div class="panel panel-lecture panel-primary" style="cursor: pointer;" >'+
        	'<div class="lectureBtn panel-heading text-center" href="#">'+
            	'<h2 class="lectureNameTxt">' + lectureName  + '</h2>'+
            '</div>'+
            
	        	'<div class="panel-body" href="#">'+
	        		'<div class="row">'+
	        			'<div class="col-md-6 col-sm-6 col-xs-6 text-center">'+
	        				'<label>Published</label>'+
							'<div class="lecture-detail-item">'+ 
								'<span id="publishStatusTxt"></span>'+ 
							'</div>'+
	        			'</div>'+
	        			'<div class="col-md-6 col-sm-6 col-xs-6 text-center">'+
	        				'<label>Open</label>'+
							'<div class="lecture-detail-item">'+ 
								'<span id="numOpenTxt"><span class="badge">0</span></span>'+ 
							'</div>'+
						'</div>'+
	        		'</div>'+
	            '</div>'+
				
			'</div>'+
		'</div>';
	
	return returnString;
}

/**
 * Called in response to getting the list of questions for a lecture
 * @param data
 * @param status
 */
function updatePublishStatus(data, status) {
	if (status == "success") {
		var result = data.responseJSON;
		var lectureId = result.lectureId;
		var questionList = result.QS;
		var total = 0;
		var numPublished = 0;
		if (questionList) {
			total = questionList.length;
			for (var i=0; i < total; i++) {
				if (questionList[i].isPublished == true) {
					numPublished++;
				}
			}
		}
		var displayClass = numPublished > 0 ? numPublished == total ? " greenBG" : " yellowBG" : "";
		$('#'+lectureId).find('#publishStatusTxt').html('<span class="badge'+displayClass+'">' + numPublished + ' of ' + total + "</span>");
	}
	else {
		alert("Error loading publish status!");
	}
}

/**
 * Called in response to getting the list of active questions.
 * @param data
 * @param status
 */
function updateNumOpenQuestions(data, status) {
	if (status == "success") {
		var result = data.responseJSON;
		var questionsList = result.QS;
		var i, questionID, title, version;
		// Count active questions for each lecture
		var lectureQuestionCounts = {};
		for (i=0; i < questionsList.length; i++) {
			if (lectureQuestionCounts[questionsList[i].lectureId + ''] > 0) {
				lectureQuestionCounts[questionsList[i].lectureId + ''] += 1;
			}
			else {
				lectureQuestionCounts[questionsList[i].lectureId + ''] = 1;
			}
		}
		// Set counts for each lecture
		for (var lectureId in lectureQuestionCounts) {
			var count;
			if (lectureQuestionCounts.hasOwnProperty(lectureId)) {
				count = lectureQuestionCounts[lectureId];
			}
			$('#'+lectureId).find('#numOpenTxt').html('<span class="badge'+(count > 0 ? " greenBG" : "") +'">'+count+'</span');
		}
	}
	else {
		alert("Error loading statuses!");
	}
}

/**
 * If you press enter then this prevents the default submit event.
 * Allows user to hit "Enter" on "Add New Lecture" dialog, instead of hitting "Submit".
 * @param event
 */
function onSubmitNewLecture(event) {
	event.preventDefault();
	$('#formSubmit').click();
}

/**
 * Click "Submit" button on modal form for adding a lecture
 */
$(document).on('click', '#formSubmit', function(event) {
	var valid = true;
	var lectureName = $('#lectureNameInput').val().trim();
	// Make sure something was entered
	if (lectureName.length <= 0) {
		valid = false;
		$('#formError').html( generateAlert("One or more fields were not set", 3) );
	}
	if (lectureName.length > 45) {
		valid = false;
		$('#formError').html( generateAlert("Lecture name exceeded 45 character limit", 4) );
	}
	if (valid) {
		var userID = sessionStorage.getItem("userID").toString();
		var courseID = sessionStorage.getItem("courseID").toString();

		// If we're in production, use the real url
		var url = sessionStorage.getItem("baseURL") + "/lecture/create";
		var data = new Object();
		data.userId = parseInt(userID);
		data.courseId = parseInt(courseID);
		data.name = lectureName;

		$.ajax({
			  method: "POST",
			  url: url,
			  contentType: "application/json",
			  data: JSON.stringify(data),
			  success: function(data, status){
		    	// If we don't get an error back, then process the data
		    	if (status == "success") {
			    	$("#myModal").modal("hide");
			    	
			    	// Add new lecture to the local storage
			    	var lectures = JSON.parse(localStorage.getItem("lectures"));
			    	lectures.push(data);
			    	localStorage.setItem("lectures", JSON.stringify(lectures));	// Store list of courses
		    		
		    		// Extract the data
					var lectureID = data.lectureId;
					var lectureName = data.name;
					
					// Clear 'no lectures' display if this is the first lecture
					if( $('#noLectures').length ){
						$("#lectures").empty();
						$('#lectures').html('<div class="row" id="pollsBtns"></div>');
					}
		    		$('#pollsBtns').append( getPollButtonHTML(lectureID, lectureName) );
		    		$('#'+lectureID).find('#publishStatusTxt').html('<span class="badge">0 of 0</span>');
    				// Make each lecture button the same height
    				var heights = $(".lectureBtn").map(function() {
    			        return $(this).height();
    			    }).get(),
    			    maxHeight = Math.max.apply(null, heights);
    			    $(".lectureBtn").height(maxHeight);
		    	}
		    	else {
		    		alert("There was an error adding the course.");
		    	}
			  }
		});
	}
});