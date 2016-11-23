/**
 * Initializations
 */
$(document).ready(function() {

	// Remove any previously set question id
	sessionStorage.removeItem("currQuestion");

	var courseID = sessionStorage.getItem("courseID");
	if (courseID == null) // Direct to login page if courseID not set
		loadpage("login");

	// Inject the edit tab contents into the main page portion of the question bank page
	$("#questionEditContent").load("../pages/poll.html #edit", function() {
		
		initTinyMCE();	// This will also load the questions

		// Tooltip Properties on Tabs
		$('[data-toggle="tab"]').tooltip({
			trigger : 'hover',
			placement : 'top',
			animate : true,
			delay : {
				show : 1000,
				hide : 100
			},
			container : 'body'
		});
		
		// Don't show publish button(s) if we're in Question Bank
		$("#publishSwitch").hide();
		$("#questionPublishTooltip").hide();

		// Sometimes screen focus is wonky, just scroll to top after
		// initializing
		window.scrollTo(0, 0);
		
		// Initialize point value elements
		initNumberSpinners();
		
		//createTaggingUI("#taggingUIcontainer");
	});

});