$(document).ready(function() {
	
	var role = sessionStorage.getItem('role');
	var courseID = sessionStorage.getItem('courseID');
	
	if(courseID == null)
		loadPage("login");
	

	
	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/courses/" + courseID + "/lectures";


	// Ask the server for a list of courses available for current user
	$.getJSON(url, lectureListCallback);
});

/**
 * Instructor - Manage lecture button pressed
 */
$(document).on('click', '.lectureBtn', function(event) {
	var lectureID = $(this).closest('.lecture-tile').attr('id');
	var lectureName = $(this).find('.panel-heading').text();
	sessionStorage.setItem("lectureID", lectureID);
	sessionStorage.setItem("lectureName", lectureName);
	loadPage("results");
});



function lectureListCallback(data, status){
	if(status == "success"){
		var lectures = data.Lectures;
		
		// Store sessions for future use
		localStorage.setItem("lectures", JSON.stringify(lectures));
		
		// Check if there are no lectures
		if(lectures.length == 0){
			var noLecturesHTML = 
				'<div class="jumbotron" id="noLectures">'+
					'<h1>No Lectures For This Course</h1>'+
					'<p>Please create a lecture and its questions in <a href="#" id="managePollsRedirect">Lecture Management</a></p>'+
				'</div>';
			$("#lectures").append(noLecturesHTML);
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
 * Instructor - Manage polls redirect link clicked
 */
$(document).on('click', '#managePollsRedirect', function(event) {
	loadPage("managepolls");
});

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
