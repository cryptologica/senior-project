function loadQuestionToStudentView(Question)
{
	var questionType = Question['type'];
	var questionTitle = Question['title'];
	var questionSetTitle = "";
	var questionContent = Question['content'];
	var questionOptions = Question['options'];
	
	var topSection =
		"<div id=\"takeQuizPanel\">" +
		"	<div><span id=\"questionSetTitle\">" + questionSetTitle + "</span><span id=\"questionTitle\">" + questionTitle +"</span></div>" +
		"<h2>"+questionContent+"</h2>";
	
	var middleSection = "";
	
	if(questionType == 1)
		{
			middleSection = "<div id=\"questionOptionBox\" class=\"questionAnswerBlock fillInBlank\">" +
								"<input id=\"questionBlank\" class=\"titleInputText\" placeholder=\"Answer Here\" type=\"text\" name=\"content\">" +
							"</div>";
		}
	else if(questionType == 0)
		{
			var middleTop = "<div id=\"questionOptionBox\" class=\"questionAnswerBlock multipleChoice\">";
			var middleMiddle = "";
			var middleBottom = "</div>";
			
			for(i = 0; i < questionOptions.length; i++)
				{
					middleMiddle += "<div class=\"multiChoiceAnswer\"> " +
										"<input id=\""+questionOptions[i]["optionId"]+"\" type=\"radio\" name=\"ans\" value=\""+questionOptions[i]["optionId"]+"\">"+questionOptions[i]["text"]+"</span>" +
									"</div>";
				}
			
			middleSection = middleTop + middleBottom + middleBottom;
		}
	
	var bottomSection = "<br>" +
						"<div><button id=\"saveAnswerButton\" type=\"button\">Save Answer</button></div>" +
						"</div>";
	
	var returnString = topSection + middleSection + bottomSection;

	return returnString;
};