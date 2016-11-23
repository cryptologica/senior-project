// When click "Manage Polls"
// Using $(document).on(...) because they're dynamically generated (otherwise listener won't be added)
$(document).on('click', '#managePollsBtn', function(event) {
	var courseID = ($(event.currentTarget).parent()).attr('id');
	sessionStorage.setItem("courseID", courseID);
	loadPage('lectures');
});

// When click "Delete Course"
$(document).on('click', '#deleteCourseBtn', function(event) {
	var courseID = ($(event.currentTarget).parent()).attr('id');
	if (confirm("Are you sure you want to delete this course?")) {
		$('#'+courseID).parent().remove();
		// TODO: Only deletes on client side
		
	}
	$('#deleteCourseBtn').button().blur();
});

// When click "Manage Results"
$(document).on('click', '#manageResultsBtn', function(event) {
	var courseID = ($(event.currentTarget).parent()).attr('id');
	sessionStorage.setItem("courseID", courseID);
	loadPage("resultsMgmt");
});


// When click "Manage Students"
$(document).on('click', '#mngStudentBtn', function(event) {
	var courseID = ($(event.currentTarget).parent()).attr('id');
	sessionStorage.setItem("courseID", courseID);
	loadPage("studentMgmt");
});


//manageResultsBtn
// HELPER FUNCTIONS:

/**
 * When the home page loads, this is called.
 * It asks the server for the list of courses.
 * courseListCallback is called upon response and populates them.
 */
function initCourses() {
	var isProduction = sessionStorage.getItem('userID');
	var userID = sessionStorage.getItem("userID");
	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/users/" + userID + "/courses";

	// If in production use real URL
	if (isProduction) {
		// Ask the server for a list of courses available for current user
		$.getJSON(url, courseListCallback);
	}
	// Otherwise use fake mocky URL
	else {
		url = "http://www.mocky.io/v2/5658f3b20f0000773b2b838e";
		$.getJSON(url, courseListCallback);
	}
}

/**
 * This function will be called when we receive
 * a response back from the server about creating a
 * course. It will send back the courseId.
 * @data Contains response data from server
 * @status If "success" no error occurred
 */
function courseListCallback(data, status) {
	// If we don't get an error back, then process the data
	if (status == "success") {
		var courses = data.Courses;
		// Extract info for each course
		for (var i = 0; i < courses.length; i++) {
			var courseID = courses[i].courseId;
			var courseName = courses[i].name;
			var instructorName = courses[i].instFName + " " + courses[i].instLName;
			var courseDescr = courses[i].description
			// Generate and add the HTML to the page
			var courseHTML = "<!-- Page Header -->"+
							 "	<div class=\"row\">"+
							 "		<div class="col-lg-12">"+
							 "			<h1 class=\"page-header\">" + courseName +
							 "				<small>" + courseDescr + "</small>" +
							 "			</h1>"+
							 "		</div>"+
							 "	</div>"+
							 "<!-- /.row -->";
			
			courseHTML += "<div class=\"row\">"+
             "<div class=\"col-lg-4 col-md-4 portfolio-item\">"+
                "<div class=\"panel panel-primary\">"+
                    "<div class=\"panel-heading\">"
                        "<div class=\"row\">"+
                            "<div class=\"col-xs-3\">"+
                                "<i class=\"fa fa-bar-chart-o fa-5x\"></i>"+
                            "</div>"+
                            "<div class=\"col-xs-9 text-right\">"|
                                "<div class=\"huge\">26</div>"+
                                "<div>New Comments!</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                    "<a href=\"#\">"+
                        "<div class=\"panel-footer\">"+
                            "<span class=\"pull-left\">Manage Polls</span>"+
                            "<span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>"+
                            "<div class=\"clearfix\"></div>"+
                        "</div>"+
                    "</a>"+
                "</div>"+
            "</div>"+
            
            "<div class=\"row\">"+
             "<div class=\"col-lg-4 col-md-4 portfolio-item\">"+
               "<div class=\"panel panel-green\">"+
                   "<div class=\"panel-heading\">"
                       "<div class=\"row\">"+
                           "<div class=\"col-xs-3\">"+
                               "<i class=\"fa fa-line-chart fa-5x\"></i>"+
                           "</div>"+
                           "<div class=\"col-xs-9 text-right\">"|
                               "<div class=\"huge\">26</div>"+
                               "<div>New Comments!</div>"+
                           "</div>"+
                       "</div>"+
                   "</div>"+
                   "<a href=\"#\">"+
                       "<div class=\"panel-footer\">"+
                           "<span class=\"pull-left\">Manage Results</span>"+
                           "<span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>"+
                           "<div class=\"clearfix\"></div>"+
                       "</div>"+
                   "</a>"+
               "</div>"+
           "</div>"+
           
           "<div class=\"row\">"+
           "<div class=\"col-lg-4 col-md-4 portfolio-item\">"+
              "<div class=\"panel panel-yellow\">"+
                  "<div class=\"panel-heading\">"
                      "<div class=\"row\">"+
                          "<div class=\"col-xs-3\">"+
                              "<i class=\"fa fa-user fa-5x\"></i>"+
                          "</div>"+
                          "<div class=\"col-xs-9 text-right\">"|
                              "<div class=\"huge\">26</div>"+
                              "<div>New Comments!</div>"+
                          "</div>"+
                      "</div>"+
                  "</div>"+
                  "<a href=\"#\">"+
                      "<div class=\"panel-footer\">"+
                          "<span class=\"pull-left\">Manage Students</span>"+
                          "<span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>"+
                          "<div class=\"clearfix\"></div>"+
                      "</div>"+
                  "</a>"+
              "</div>"+
          "</div>"+
          "</div>"+
          "<!-- end row -->";

			$("#courses").append(courseHTML);
		}
	}
	else {
		alert("There was an error retrieving the course list from the server.");
	}
	$('.oneCourse').buttonset();
}

/**
 * This function will be called when we receive
 * a response back from the server with the
 * courseId for the newly created course.
 * @data Contains response data from server
 * @status If "success" no error occurred
 */
function courseCreateCallback(data, status) {
	// If we don't get an error back, then process the data
	if (status == "success") {
		// Extract the courseId
		var courseID = data.classId;
		var courseName = data.name;
		var courseDescr = data.description;
		$("#dialog-form").dialog("close");
		var courseHTML = '<fieldset class="courseFieldset"><legend>' + courseName + ' - ' + courseDescr + '</legend><div class="oneCourse" id="' + courseID + '"> <button id="managePollsBtn">Manage Lectures</button><div class="divider"></div><button>Manage Results</button><div class="divider"></div><button id="mngStudentsBtn">Manage Students</button><div class="divider"></div><button id="deleteCourseBtn">Delete Course</button></div></fieldset>';
		// Add the HTML to the page
		$("#coursesID").append(courseHTML);
	}
	else {
		alert("There was an error adding the course.");
	}
	$('.oneCourse').buttonset();
}

/**
 * Initialize the dialog when home template loads so
 * it's ready when we want to use it.
 */
function initCreateForm() {
	var dialog, form;
	var name = $("#name");
	var descr = $("#descr");
	var allFields = $([]).add(name).add(descr);

	dialog = $("#dialog-form").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		// modal -> can only interact with dialog
		modal: true,
		// Add "Create" and "Cancel" buttons
		buttons: {
			"Create": addCourse,
			Cancel: function () {
				dialog.dialog("close");
				// Fix a bug that doesn't remove hover/focus
				$('#add-course').button().blur();
			}
		},
		// When you click the "X" button
		close: function () {
			form[0].reset();
			allFields.removeClass("ui-state-error");
			$('#add-course').button().blur();
		}
	});

	// Add the course when they click "Create"
	form = dialog.find("form").on("submit", function (event) {
		// Don't do any submit stuff, just call addCourse()
		event.preventDefault();
		addCourse();
	});

	// Add listener to "Add Course" button to open dialog on click
	$("#add-course").button().on("click", function () {
		dialog.dialog("open");
	});

	// Leave this function here so it can access allFields var, etc...
	function addCourse() {
		var valid = true;
		allFields.removeClass("ui-state-error");
		var courseName = name.val().trim();
		var courseDescr = descr.val().trim();
		// Make sure something was entered
		if (courseName.length <= 0 || courseDescr.length <= 0) {
			valid = false;
			$("<div title='Error' class='ui-state-error'>One or more fields are empty!</div>").dialog();
			$('button').button().blur();
		}
		if (valid) {
			var url = sessionStorage.getItem("baseURL") + "/courses/create";
			var userID = sessionStorage.getItem("userID");
			var data = JSON.stringify({
					"name": courseName,
					"description": courseDescr,
					"userId": parseInt(userID)
			});
			// If in production use real url
			if (sessionStorage.getItem("isProduction")) {
				$.ajax({
				    type: 'POST',
				    url: 	url,
				    data: data,
				    success: courseCreateCallback,
				    contentType: "application/json",
				    dataType: 'json'
				});
			}
			// Otherwise use mocky url
			else {
				url = "http://www.mocky.io/v2/5653cf370f0000560760c0e7";
				$.getJSON(url, data, courseCreateCallback);
			}
		}
		return valid;
	}
}