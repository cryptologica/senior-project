// When click a Lecture
$(document).on('click', '.lectureGroup', function(event) {
	var lectureID = ($(event.currentTarget)).attr('id');
	sessionStorage.setItem("lectureID", lectureID);
	console.log("lectureID = " + lectureID);

	loadQuestionsAndPage(1, "quiz");	// Loads manage poll page with initialized questions pane
	//loadPage("quiz");
});

// When click "Add Lecture"
$(document).on('click', '#add-lecture', function(event) {
	event.preventDefault();
	//$('#createLectureForm').modal('show');
	$("#lecture-dialog-form").show();
});

/**
 * Initialize the dialog when lecture page loads
 * so it's ready when we want to use it.
 */
function initLectureForm() {
	var dialog, form;
	var name = $("#name");
	var allFields = $([]).add(name);

	dialog = $("#lecture-dialog-form").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		// modal -> can only interact with dialog
		modal: true,
		// Add "Create" and "Cancel" buttons
		buttons: {
			// Call function 'addLecture' when 'Create' button in dialog is clicked
			"Create": addLecture,
			Cancel: function () {
				dialog.dialog("close");
				// Fix a bug that doesn't remove hover/focus
				$('#add-lecture').button().blur();
			}
		},
		// When you click the "X" button
		close: function () {
			form[0].reset();
			allFields.removeClass("ui-state-error");
			$('#add-lecture').button().blur();
		}
	});

	/**
	 * Call when you want to ask server to add a lecture.
	 * Note: Keep inside initLectures() so it can easily
	 * access the dialog variables.
	 */
	function addLecture() {
		var valid = true;
		allFields.removeClass("ui-state-error");
		var lectureName = name.val().trim();
		// Make sure something was entered
		if (lectureName.length <= 0) {
			valid = false;
			// TODO: Make this an actual dialog at some point
			alert("One or more fields are empty!");
		}
		if (valid) {
			var userID = sessionStorage.getItem("userID").toString();
			var courseID = sessionStorage.getItem("courseID").toString();

			// If we're in production, use the real url
			if (sessionStorage.getItem("isProduction")) {
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
					  success: lectureCreateCallback
				});
			}
			// Otherwise, use mocky URL
			else {
				url = "http://www.mocky.io/v2/565bfccf1000001b218a357b";
				$.ajax({
					  method: "POST",
					  url: url,
					  success: lectureCreateCallback
				});
			}
		}
		return valid;
	}

	// Add the lecture when they click "Create"
	form = dialog.find("form").on("submit", function (event) {
		// Don't do any submit stuff, just call addlecture()
		event.preventDefault();
		addLecture();
	});

	// Add listener to "Add Lecture" button to open dialog on click
	$("#add-lecture").button().on("click", function () {
		dialog.dialog("open");
	});
}

/**
 * When the page loads, this is called.
 * It asks the server for the list of lectures available to current user.
 * lectureListCallback is called upon response and populates them.
 */
function initLectures_Lectures() {
	// If in production use the real URL
	if (sessionStorage.getItem("isProduction")) {
		var courseID = sessionStorage.getItem("courseID");
		if (courseID.length <= 0) {
			alert("ERROR: Could not get valid courseID");
			return;
		}
		var url = sessionStorage.getItem("baseURL") + "/courses/" + courseID + "/lectures";
		$.ajax({
			  method: "GET",
			  url: url,
			  success: lectureListCallback
		});
	}
	// Otherwise use fake mocky URL
	else {
		url = "http://www.mocky.io/v2/5655469e0f00005d0c282b9a";
		$.ajax({
			  method: "GET",
			  url: url,
			  success: lectureListCallback
		});
	}
}

/**
 * This function will be called when we receive
 * a response back from the server about getting
 * a list of the lectures available for a course.
 * @data Server response JSON
 * @status If "success", no error occurred
 */
function lectureListCallback(data, status) {
	// If we don't get an error back, then process the data
	if (status == "success") {
		var lectures = data.Lectures;
		// Extract info for each course
		for (var i = 0; i < lectures.length; i++) {
			var lectureID = lectures[i].lectureId;
			var lectureName = lectures[i].name;
			// Generate and add the HTML to the page
			var lectureHTML = '<button id="' + lectureID + '" class="lectureGroup">' + lectureName + '</button>';
			$("#lectureGroups").append(lectureHTML);
			// This makes all the buttons jquery-ui buttons so they follow theme
			$('button').button();
		}
	}
	else {
		alert("There was an error retrieving the lecture list from the server.");
	}
}

/**
 * This function will be called when we receive
 * a response back from the server with the
 * lectureId.
 * @data Server response JSON
 * @status If "success", no error occurred
 */
function lectureCreateCallback(data, status) {
	// If we don't get an error back, then process the data
	if (status == "success") {
		// Extract the lectureId
		var lectureID = data.lectureId;
		var lectureName = data.name;
		$("#lecture-dialog-form").dialog("close");
		var lectureHTML = '<button id="' + lectureID + '" class="lectureGroup">' + lectureName + '</button>';
	    // Add the HTML to the page
		$("#lectureGroups").append(lectureHTML);
	}
	else {
		alert("There was an error adding the lecture.");
	}
	// Make sure newly added html buttons are converted to jquery-ui buttons.
	$('button').button();
}