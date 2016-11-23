
/**
 * Sidebar.js - Initializes the active and available questions on the left-hand side of the polling pages.
 *
 * 	TODO: Extend to allow support for instructor to add new questions.
 *  TODO: Add support for student's active questions to be updated accordingly
 */


/**
 * Instructor requests all questions for a lecture, either for results or question editing,
 * results are populated on the left-hand sidebar
 */
function initSidebarAllQuestions(){
	$('button').button();
	initAllQuestions();
}

/**
 * Student requests active questions to be populated on left-hand sidebar
 */
function initSidebarActiveQuestions(){
	$('button').button();
	initAllActiveQuestions();
}

/**
 * When the page loads, this is called.
 * It asks the server for the list of lectures questions available to current lecture.
 * questionListCallback is called upon response and populates them.
 */
function initAllQuestions() {
		var lectureID = sessionStorage.getItem("lectureID");
		if (lectureID.length <= 0) {
			alert("ERROR: Could not get valid lectureID");
			return;
		}
		var url = sessionStorage.getItem("baseURL") + "/lecture/" + lectureID;

		$.getJSON(url, questionListCallback);
		//HTTP.call("GET", url, questionListCallback);
}

/**
 * Note: Special function for instructor quiz page.
 *
 * When the instructor quiz page loads, this is called.
 * It asks the server for the list of lecture questions for the specifified lecture.
 * questionListInstrQuizCallback is called upon response and populates them.
 */
function initAllQuestionsInstrQuiz() {
		var lectureID = sessionStorage.getItem("lectureID");
		if (lectureID.length <= 0) {
			alert("ERROR: Could not get valid lectureID");
			return;
		}
		var url = sessionStorage.getItem("baseURL") + "/lecture/" + lectureID;

		$.getJSON(url, questionListInstrQuizCallback);
}

/**
 * Asks the server for the list of lectures questions available to current course.
 * questionListCallback is called upon response and populates them.
 */
function initAllActiveQuestions() {
	var courseId = sessionStorage.getItem("courseID");
	if (courseId.length <= 0) {
		alert("ERROR: Could not get valid courseID");
		return;
	}
	var url = sessionStorage.getItem("baseURL") + "/courses/" + courseId + "/status";

	$.getJSON(url, questionListCallback);
	//HTTP.call("GET", url, questionListCallback);
}

/**
 * This function will be called when we receive
 * a response back from the server about getting
 * a list of questions.
 * @error NULL if no error
 * @result Contains response data from server
 */
function questionListCallback(data, status) {

	// If we don't get an error back, then process the data
	if (status == "success") {

		$("#lectureName").text(data.name);	// Populate name of the question

		var questions = data.QS;
		$("#resultsGroups").empty();

		// Extract info for each course
		for (var i = 0; i < questions.length; i++) {
			var questionID = questions[i].questionId;
			var title = questions[i].title;
			var version = questions[i].version;
			// Generate and add the HTML to the page
			var questionHTML = '<button id="' + questionID + '" class="questionGroup" version="' + version +'" value ="'+i+'">' + title + '</button><br>';

			console.log("Got questionHTML: " + questionHTML);
			
			$("#resultsGroups").append(questionHTML);
			// This makes all the buttons jquery-ui buttons so they follow theme
			$('button').button();
		}
	} else {
		alert("There was an error retrieving the question list from the server.");
	}
}

/**
 * Note: Special function so we can inject stuff specifically
 * for the instructor quiz page.
 *
 * This function will be called when we receive
 * a response back from the server about getting
 * a list of questions.
 * @error NULL if no error
 * @result Contains response data from server
 */
function questionListInstrQuizCallback(data, status) {

	// If we don't get an error back, then process the data
	if (status == "success") {

		$("#lectureName").text(data.name);	// Populate name of the lecture

		var questions = data.QS;

		// Extract info for each course
		for (var i = 0; i < questions.length; i++) {
			var questionID = questions[i].questionId;
			var title = questions[i].title;
			var version = questions[i].version;
			// Generate and add the HTML to the page
			var questionHTML = '<fieldset class="playBtnGroup"> <table><tr><td> <img src="./img/play_off.ico" class="img-swap"></td><td> <button id="' + questionID + '" class="questionGroup" version="' + version +'">' + title + '</button></td></tr></table></fieldset>';

			console.log("Got Question: title=" + title + " version=" + version + " questionId=" + questionID);

			$("#resultsGroups").append(questionHTML);
			// This makes all the buttons jquery-ui buttons so they follow theme
			$('button').button();
		}
		// Make an Add Question button at bottom of left nav pane
		$('#leftNav').append('<button id="newQuestionBtn">New Question</button>');
		$('#newQuestionBtn').button();

		// Hide play/stop button until we know they're up-to-date
		$('.playBtnGroup').hide();
		// Successfully added all the questions, make sure none of them are already active
		updateQuestionStatuses();
		// Redisplay them in updateQuestionStatusescallback
	}
	else {
		alert("There was an error retrieving the question list from the server.");
	}
}