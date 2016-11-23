var courseNames = [];
var courses = [];
var limit = 0;
var currentId = -1;
var index = -1;
var userid;
var baseURL;

// Function to run when the page is loaded
$(document).ready( function () {
	initialize();
} );

function initialize() {
	baseURL = sessionStorage.getItem("baseURL");
	userid = parseInt(sessionStorage.getItem('userID'));
	
	$.ajax({
		    method : 'GET',
		    ContentType: 'application/json', 
		    url : baseURL + "/users/" + userid +"/courses/joinable",
		    success: getClass,
		    error: getClass
	});
};

// Clicks "Join Course"
$(document).on('click', '.joinCourseBtn', function(event) {
	
	var courseId = $(this).attr('courseid');
	var name = $(this).attr('name');
	var userId = parseInt(sessionStorage.getItem('userID'));
	
	sessionStorage.setItem("courseID", courseId);
	sessionStorage.setItem("courseName", name);
	$.ajax({
	    type: 'POST',
	    url: 	baseURL +"/courses/" + courseId + "/join",
	    data: JSON.stringify({"userId" : userId}),
	    success: addCourseCallback,
	    error: addCourseCallback,
	    contentType: "application/json",
	    dataType: 'json'
	});
	
});

// Does not wish to add another class.
$(document).on('click', '#quitAddCourseBtn', function(event) {
	loadPage("home_student");
});


function addCourseCallback(result, status) {
	console.log(result);
	if (status == "success")
	{
		var courseID = result.classId;
		sessionStorage.setItem("courseID", courseID);
		$('#addCourseModal').modal('show');
	}
	else
	{
		$('#joinedCourseModal').modal('show');
		//$('div[id="formError"]').html( generateAlert("Failed to add Class.", 4) );
	}
};

function getClass(result, status) {
	if (status == "success") {
		courses = result.Courses;
		var courseNames = [];
		for (var i = 0; i < courses.length; i++) {
			courseNames.push(courses[i].name);
		}
		addDataToSearchTable(courses);
		$("#searchButton").click();
	}
	else {
		$('div[id="formError"]').html( generateAlert("No classes exist in the system.", 2) );
	}
};

function splitDataForTable(data) {
	if (data.length < 35) {
		return data;
	}
	
	//get each word
	var res = data.split(" ");
	
	//get the length of each word
	var len = [];
	for(var i = 0; i< res.length; i++)
		{
			len[i] = res[i].length;
		}
	
	//split data by character limit by nearest whole word
	var tot = 0;
	var resdata = "";
	var finish = "";
	var limit = 35;
	for(var j = 0; j < len.length; j++)
		{
			tot += len[j] + 1;
			if(tot < limit)
				{
					resdata += res[j] + " ";
				}
			else
				{
					finish += resdata + "<br>";
					tot = 0;
					limit = 50;
					j--;
					resdata = "";
				}
		}
	finish += resdata;
	
	//var result = data.substring(0, 35) + "<br>";
	//data = data.substring(35);
	//for (var i=0; i < data.length; i++) {
		//result += data.substring(0, 50) + "<br>";
		//data = data.substring(50);
	//}
	return finish;
}

function addDataToSearchTable(courses) {
	var coursesHTML = "";
	for (var i = 0; i < courses.length; i++) {
		courses[i].description = splitDataForTable(courses[i].description);
		coursesHTML += "<tr>" +
					  	"<td>" + courses[i].name + "</td>" +
					  	"<td>" + courses[i].fName + " " + courses[i].lName + "</td>" +
					  	"<td>" + courses[i].description + "</td>" +
					  	"<td> <button class='joinCourseBtn btn btn-primary' name = '"+courses[i].name+"' courseId='"+courses[i].courseId+"'> Join Course</button> </td>" +
					  "</tr>";
	}
	$('#searchTableData').append(coursesHTML);
	$('#loadClassListSpinner').hide();
	$('#searchTable').show();
	$('#searchTable').DataTable( {
		"sScrollX": "100%",
	    "bScrollCollapse": true,
		"lengthChange": false,
		"info": false,
		"pagingType": "numbers"
	});
}
