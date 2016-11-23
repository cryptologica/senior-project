$(document).on('click',"#exportTestLink", function(e) {

	console.log("clicky")
	
	exportLectureForCSV(window.lectureResults,window.studentList,null);

	//
});

//Makes a lecture csv and meta.csv for the lecture
function exportLectureForCSV(resultData,studentData,flags)
{
	
	var resultRows = makeResultRowsFromData(resultData,studentData,flags);
	
	//var downloadStreamHeader = "data:application/octet-stream,";
	var downloadStreamHeader = "data:text/csv;charset=utf-8;base64,";
	
	//Headers for the results on basic expor
	var basicHeaderRow = ["UserID", "Last_Name", "First_Name", "Point_Total"];
	
	//var fakeStudentRow = ["1234567", "Fox", "Toni", "10"];
    
	//Artificial payload
	var downloadStreamContent = "";//"field1%2Cfield2%0Afoo%2Cbar%0Agoo%2Cgai%0A";
	
	for(s in basicHeaderRow)
	{
		downloadStreamContent += basicHeaderRow[s] + ",";
	}
	downloadStreamContent+="\n";
	
	downloadStreamContent +=resultRows;
	
	//downloadStreamContent = encodeURIComponent(downloadStreamContent);
	console.log(downloadStreamContent);
	
	//thanks to http://stackoverflow.com/questions/8485027/javascript-url-safe-filename-safe-string
	var lectureName = sessionStorage.getItem("lectureName");
	var filename = lectureName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
	var date = (new Date() + "").replace(/[^a-z0-9]/gi, '_').toLowerCase();
	
	//'' +;
    $("#lectureResultsLink").attr("href", downloadStreamHeader+window.btoa(downloadStreamContent));
	$("#lectureResultsLink").attr("download", filename + "_" + date + ".csv");
	$("#lectureResultsLink")[0].click();
}

function makeResultRowsFromData(resultData,studentData,flags)
{
	var streamContent =""
	//find each student in the class and make a row for them
	var currentStudent;
	var studentTotalPoints;// = 0;
	
	var currentUsers;
	var optionCorrect;// = false;
	var numberCorrectOnQuestion;
	var questionPointValue;
	var currentQuestionResults;
	//Check each question and see if this student gave any responses
	for(s in studentData["Students"])
	{
		currentStudent = studentData["Students"][s];
		if(currentStudent["studentId"] == "razorback")
			console.log(currentStudent);
		
		studentTotalPoints = 0;
		
		for (r in resultData["lectureResults"])
		{
			//how many things i got right on this question
			numberCorrectOnQuestion = 0;
			
			currentQuestionResults = resultData["lectureResults"][r]["results"];
			
			//get some question attributes
			
			//questionPointValue = currentQuestionResults["value"]; //<-- not used yet
			/*
			if(currentStudent["studentId"] == "razorback")
			{
				console.log(currentQuestionResults);
			}*/
			//
			
			for(a in currentQuestionResults)
			{
				currentUsers = currentQuestionResults[a]["users"];
				optionCorrect = currentQuestionResults[a]["correct"];
				
				/*
				if(currentStudent["studentId"] == "razorback")
				{
					//console.log(currentUsers);
					//console.log(optionCorrect);
				}*/
				
				for(u in currentUsers)
					{
						//if the current user is me, and i got it right, i got an option right on this question
						if(currentUsers[u]["userID"] == currentStudent["userId"] && optionCorrect)
							numberCorrectOnQuestion++;
					}
			}
			
			studentTotalPoints += numberCorrectOnQuestion;
		}
		
		streamContent += currentStudent["studentId"]+","+currentStudent["lName"]+","+currentStudent["fName"]+","+studentTotalPoints+"\n";
	}
	
	
	return streamContent;
}