
var url = "http://student-145.coe.utah.edu:8110/TuringPoint/";
var userId = "";

var course = "";
var timer = "";

var questionVersion = "";
var currentPage = "";
var questionId = "";
var questionIndex = -1;
var version = "";
var QSlength = -1;
var ansCheck = {};
var type = "";
var QS = "";


function initializeQuiz(page)
{
	url = sessionStorage.getItem("baseURL") + "/";
	userId = parseInt(sessionStorage.getItem("userID"));
	course = sessionStorage.getItem("courseID");
	ansCheck = sessionStorage.getItem("ansCheck");
	if(ansCheck == null)
		ansCheck = {};
	currentPage = page;
	document.getElementById("lectureName").innerHTML = "Quiz";
	$.ajax({
	    method : 'GET',
	    ContentType: 'application/json',
	    url : url +"courses/" + course + "/status",
	    success: quizCallback,
	    error: quizCallback
	    });

};

function time()
{
	$.ajax({
	    method : 'GET',
	    ContentType: 'application/json',
	    url : url +"courses/" + course + "/status",
	    success: timeCallback,
	    error: timeCallback
	    });
};

function timeCallback(result, error)
{
	if(error == "success" && currentPage == "takeQuiz")
	{
		$.ajax({
		    method : 'GET',
		    ContentType: 'application/json',
		    url : url +"courses/" + course + "/status",
		    success: updateQuiz,
		    error: updateQuiz
		    });
	}
	else
	{
		//clearTimeout(timer);
		//alert("time fail");
		if(currentPage =="takeQuiz")
			{
			loadPage("homepage");
			}
	}
};

function updateQuiz(result, error)
{
	if(error == "success" && result.QS.length == QSlength)
		{
		if(result.QS[questionIndex] == null)
			{
			alert("current question went -> KABOOM! -> sent to first question");
			questionIndex = 0;
			}
		for(var i = 0; i < result.QS.length; i++)
			{
			if(parseInt(result.QS[i].questionId) == questionId)
				{
				questionIndex = i;
				}
			}
		if(parseInt(result.QS[questionIndex].version) == version)
		{
		console.log("no update needed");
		}
		else
			{
			if(questionIndex == -1)
				{
					questionIndex = 0;
				}
			
			console.log("updating question");
			QS = result.QS;
			console.log(result);
			QSlength = QS.length;
			version = parseInt(result.QS[questionIndex].version);
			var title = result.QS[questionIndex].title;
			questionId = parseInt(result.QS[questionIndex].questionId);
			for(var i = 0; i < result.QS.length; i++)
			{
			if(ansCheck[result.QS[i].questionId] == null)
				ansCheck[result.QS[i].questionId] = false;
			}
			document.getElementById("quizTitle").innerHTML = title;
			getQuestion(questionId);
			}
			initSidebarActiveQuestions();
		}
	if(result.QS.length == 0 && QSlength != -1)
		{
		//clearTimeout(timer);
		if(currentPage =="takeQuiz")
		{
			document.getElementById("takeQuizPanel").innerHTML = "";
			var HTML  ='<div><span id="quizTitle">Question group here, empty if no group use a delimiter if not empty | </span> | <span id="questionTitle">Question Title here</span></div><h2 id = "questionText">Question Text Here</h2><div id="questionOptionBox" class="questionAnswerBlock multipleChoice"><div class="multiChoiceAnswer"><input id="optionId1" type="radio" name="ans" value="0">Answer Option 1</div><div class="multiChoiceAnswer"><input id="optionId1" type="radio" name="ans" value="1">Answer Option 2</div><div class="multiChoiceAnswer"><input id="optionId1" type="radio" name="ans" value="2">Answer Option 3</div><div class="multiChoiceAnswer"><input id="optionId1" type="radio" name="ans" value="3">Answer Option 4</div></div>';
			$("#takeQuizPanel").append(HTML);
			questionId = "";
			questionIndex = -1;
			version = "";
			QSlength = -1;
			ansCheck = {};
			type = "";
			QS = "";
			initSidebarActiveQuestions();
			//timer = setInterval(time, 10000);
		}
		}
	if(result.QS.length == 0 && QSlength == -1)
		{
		console.log("no updated needed");
		}
	else
		{
		if(questionIndex == -1)
		{
			questionIndex = 0;
		}
		if(result.QS[questionIndex] == null)
		{
		alert("current question went -> KABOOM! -> sent to first question");
		questionIndex = 0;
		}
		for(var i = 0; i < result.QS.length; i++)
		{
		if(parseInt(result.QS[i].questionId) == questionId)
			{
			questionIndex = i;
			}
		}
		console.log("updating question");
		QS = result.QS;
		console.log(result);
		QSlength = QS.length;
		version = parseInt(result.QS[questionIndex].version);
		var title = result.QS[questionIndex].title;
		questionId = parseInt(result.QS[questionIndex].questionId);
		for(var i = 0; i < result.QS.length; i++)
		{
		if(ansCheck[result.QS[i].questionId] == null)
			ansCheck[result.QS[i].questionId] = false;
		}
		document.getElementById("quizTitle").innerHTML = title;
		getQuestion(questionId);
		initSidebarActiveQuestions();
		}
};

function getQuestion(questionId)
{
	console.log("creating question");
	$.ajax({
	    method : 'GET',
	    ContentType: 'application/json',
	    url : url +"question/" + questionId,
	    success: createQuestion,
	    error: createQuestion
	    });
};

function createQuestion(result, error)
{
	if(error == 'success')
		{
		questionVersion = parseInt(result.version);
		var title = result.title;
		var content = result.content;
		type = parseInt(result.type);
		var options = result.options;

		document.getElementById("questionTitle").innerHTML = title;
		document.getElementById("questionText").innerHTML = content;
		if(document.getElementById("questionOptionBox") == null)
			{
			$("#boxHolder").append('<div id="questionOptionBox" class="questionAnswerBlock">');
			}
		document.getElementById("questionOptionBox").innerHTML = "";
		if(type == 0)
			{
			for(var i = 0; i< options.length; i++)
				{
					var html = '<div class="multiChoiceAnswer"><input id="optionId1" type ="radio" name="ans" value="'+parseInt(options[i].optionId)+'">'+options[i].text+'</span></div>';
					$("#questionOptionBox").append(html);
				}
			}
		if(type == 1)
			{
				var html = '<div class = "fillin"><textarea id ="textArea"></textarea></dv>';
				$("#questionOptionBox").append(html);
			}

		}
	else
		{
		alert("problem creating quiz");
		}
};

$(document).on('click', '#saveAnswerButton', function(event) {
	event.preventDefault();
	if(QS.length != 0)
		{
		var answer = "";
		if(type == 0)
			{
				answer = $("input[name='ans']:checked").val();
			}
		if(type == 1)
			{
				answer = $("#textArea").val();
			}
	var q = {"userId": userId, "optionId" : parseInt(answer), "version": questionVersion};
	if(type == 1)
		{
		q = {"userId": userId, "response" : answer, "version": questionVersion};
		}
	console.log(q);
	var method = "";
	if(!ansCheck[questionId])
		{
		method = "POST"
		ansCheck[questionId] = true;
		sessionStorage.setItem("ansCheck", ansCheck);
		}
	else
		{
		method = "PUT"
		}
	$.ajax({
	    type: method,
	    url: 	url +"question/" + questionId + "/answer",
	    data: JSON.stringify(q),
	    success: answerCallback,
	    error: answerCallback,
	    contentType: "application/json",
	    dataType: 'json'
	});
		}
});

function answerCallback(result, error)
{
	if(error = "success")
		{
		alert("answer was saved");
		}
	else
		{
		alert("error answering question");
		}
};

function quizCallback(result, error)
{
	QS = result.QS;
	if(error == "success" && QS.length != 0)
	{
		QSlength = QS.length;
		questionIndex = 0;
		console.log(result);
		version = parseInt(result.QS[0].version);
		var title = result.QS[0].title;
		questionId = parseInt(result.QS[0].questionId);
		document.getElementById("quizTitle").innerHTML = title;
		for(var i = 0; i < result.QS.length; i++)
			{
			if(ansCheck[result.QS[i].questionId] == null)
				ansCheck[result.QS[i].questionId] = false;
			}
		getQuestion(questionId);
		
	}
	else
	{
		alert("no questions available");
	}
	//timer = setInterval(time, 10000);
};

$(document).on('click', '.questionGroup', function(event) {
	// TODO: Discuss better way to share sidelist stuff
	if (sessionStorage.getItem("role") == "STUDENT") {
		event.preventDefault();
		questionId = this.id;
		questionIndex = event.currentTarget.value;
		getQuestion(questionId);
	}
});

