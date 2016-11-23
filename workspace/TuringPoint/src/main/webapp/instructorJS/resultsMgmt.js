//This is the js file for results management - i copied lecute as the first bit

function initializeResultsMgmt()
{	
	initLectures_results();
}

function initLectures_results(){
	console.log("init lecture buttons");
	var courseID = sessionStorage.getItem("courseID");
	if (courseID.length <= 0) {
		alert("ERROR: Could not get valid courseID");
		return;
	}
	var url = sessionStorage.getItem("baseURL") + "/courses/" + courseID + "/lectures";
	$.ajax({
		  method: "GET",
		  url: url,
		  success: buildLectureButtons_results
	});
	
	/*
	var url = sessionStorage.getItem("baseURL") + "/courses/" + courseID + "/lectures";
	$.ajax({
		  method: "GET",
		  url: url,
		  success: buildLectureButtons
	});
	*/
	
	/////////////Fake lecture making//////////////////
	buildLectureRows_results(null,null);
}

function buildLectureRows_results(data,status) {
	
	var lectureDates = ["12/9/2015","12/10/2015","12/11/2015"];
	var lectureNames = ["The art of flight","Joys of cooking","Swimming"];
	var lectureMaxs = [50,25,30];
	var lectureAvgs = [35,20,25];
	
	for(i = 0; i < 3; i++)
		{
			var obj = {};
			obj["date"] = lectureDates[i];
			obj["name"]=lectureNames[i];
			obj["max"]=lectureMaxs[i];
			obj["avg"]=lectureAvgs[i];
			
			createLectureRow_results(obj);
		}
	
}

function createLectureRow_results(LectureScore) {
	
	var dateUpdated = LectureScore["date"];
	var lectureName= LectureScore["name"];
	var lectureMax=LectureScore["max"];
	var lectureAvg= LectureScore["avg"];
	
	var percent = lectureAvg / lectureMax;
	percent = (percent*100).toFixed(1) + "%"
	
	var ret = "<tr id=\"lectureRow1\"><td>"+dateUpdated+"</td><td id=\"lectureName1\">"+lectureName+"</td><td id=\"lectureScore1\">("+lectureAvg+"/"+lectureMax+") "+percent+"</td></tr>"

	var diglet = $("#resulsTable");
	diglet.append(ret);
}

function buildLectureButtons_results(data, status) {
	
	console.log("build lecture buttons");
	
	var lectureList = data["Lectures"];
	console.log(lectureList)
	for(i = 0; i < lectureList.length; i++) {
		createLectureButton_results(lectureList[i]);
	}
}

function createLectureButton_results(Lecture) {
	
	if (('lectureId' in Lecture) && ('name' in Lecture)) {
		var title = "View " + Lecture["name"] + " details...";
		var id = Lecture["lectureID"];
		var span = Lecture["name"];
		
		var ret = 	"<div class=\"lectureButton padded centered\">" + 
						"<button title=\""+title+"\" id=\""+id+"\" role=\"button\">" +
							"<span>"+span+"</span>" +
						"</button>" + 
						"<br>" + 
					"</div>";
		
		var diglet = $("#lectureGroups");
		diglet.append(ret);
	}
	else {
		console.log("Error, lecture object does not contain required fields")
	}
}