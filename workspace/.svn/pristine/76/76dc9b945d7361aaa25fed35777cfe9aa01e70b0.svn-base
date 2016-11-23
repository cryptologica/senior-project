//Init has to be done here so all libraries get the tools they need prior to trying to use them
$(window).load(function(){ 
	setInterval(doActivePollWork,1000) 


	// Remove any previously set question id
	sessionStorage.removeItem("currQuestion");
	
	presentationparentWindow = window.opener;
	
	//get font size for presenting
	presentationFontSize = presentationparentWindow.window.presentationFontSize
	presentationcurrentQuestionData = presentationparentWindow.window.currentQuestionData;
	
	$("#presentTab").click();
	document.body.style.visibility='visible'

});
///////////////////////////////////////////////////////////////////////////////////////
/////////////////cross window events from parent///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

function checkQuestionChange()
{
	var newQuestionData = presentationparentWindow.window.currentQuestionData;
	if(!newQuestionData)
		console.log("parent window had null data");
	if(newQuestionData == presentationcurrentQuestionData)
		return false;
		
	presentationcurrentQuestionData = newQuestionData;
	return true;
}

function checkFontChange()
{
	var newpresentationFontSize = presentationparentWindow.window.presentationFontSize
	if(newpresentationFontSize == presentationFontSize)
		return false;
	
	presentationFontSize = newpresentationFontSize;
	return true;
}

function doActivePollWork()
{
	console.log("checking for update");
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"detailPanel" ]);
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"presentationText" ]);
	if(checkQuestionChange())
		$("#presentTab").click();
	
	if(checkFontChange())
		fillInPollPresentationInfo(true);
	
	
}



///////////////////////////////////////////////////////////////////////////////////////
/////////////////Presentation tab//////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

$(document).on('click', '#presentTab', function(event) {
	window.currentTab = "present"
	//window.shownQuestionID = presentationcurrentQuestionData["questionId"]
	//selectQuestion(window.shownQuestionID)
	fillInPollPresentationInfo(true);
});

/*
function fillInPollPresentationInfo()
{
	var data = presentationcurrentQuestionData
	//console.log(data)
	$("#presentationTable").find(".generatedTableRow").remove();
	$("#presentationTitle").html(data.title);
	$("#presentationText").html(data.content);
	
	if (data.type == 0) {
		tableHTML ="";
		
		for(var i = 0; i < data["options"].length; i++)
		{
	
			tableHTML += "<tr class=\"generatedTableRow\"><td><span class=\"presentBullet\"></span>"+data["options"][i]["text"]+"</td></tr>";
		}
		
		$("#presentationTable").append(tableHTML);
		$("#responseText").html("Choose the most correct response")
	}
	if (data.type == 1) {
	
		$("#responseText").html("Please give a short answer")
	}
	
	redrawFontSizeButtonsAndPresentationFonts()
}

function redrawFontSizeButtonsAndPresentationFonts()
{
	var presentationFontSizes = {};
	presentationFontSizes[0]='xx-small';
	presentationFontSizes[1]='x-small';
	presentationFontSizes[2]='small';
	presentationFontSizes[3]='medium';
	presentationFontSizes[4]='large';
	presentationFontSizes[5]='x-large';
	presentationFontSizes[6]='xx-large';
	
	$("#presentationTitle").css("fontSize", presentationFontSizes[presentationFontSize]);
	$("#presentationText").css("fontSize", presentationFontSizes[presentationFontSize]);
	$("#presentationTitle").css("fontWeight", "bolder");
	$("#presentationText").css("fontWeight","bolder");
	$("#responseText").css("fontSize", presentationFontSizes[presentationFontSize]);
	$(".generatedTableRow").css("fontSize", presentationFontSizes[presentationFontSize]);
}*/

///////////////////////////////////////////////////////////////////////////////////////
/////////////////Review tab////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


$(document).on('click', '#reviewTab', function(event) {
	//console.log("on Review tab")
	window.currentTab = "review"
	window.shownQuestionID = presentationcurrentQuestionData["questionId"]
	selectQuestion(window.shownQuestionID)

});

/**
 * Clicking the refresh answers button
 */
$(document).on('click', '#refreshResultsBtn', function(event) {
	window.currentTab = "review"
	window.shownQuestionID = window.currentQuestionData["questionId"]
	selectQuestion(window.shownQuestionID)

});

/**
 * Authentication handling
 */
$(document).ajaxSend(function (event, jqxhr, settings) {
	var auth = Cookies.get("Authorization");
	//var loggingIn = Cookies.get("loggingIn");
	if(auth != null)
		jqxhr.setRequestHeader('Authorization', auth);
	//else
		//loadPage("login");
});

