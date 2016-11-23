

//event handler for searching for a lecture
$(document).on('click', '#searchButton', function(event)
{
	event.preventDefault();
	
	//make button not clickable while loading
	document.getElementById("searchButton").disabled = true;
	document.getElementById("clearButton").disabled = true;
	
	//hide process of lecture and tags being added to lectureGroup
	//$("#lectureGroups").addClass("hidden");
	
	var courseID = sessionStorage.getItem("courseID");
	baseURL = sessionStorage.getItem("baseURL");
	$("#lectureGroups").empty();
	$('div[id="formError"]').empty();
	//change image of button
	$("#searchButton").empty();
	$("#searchButton").append('<i class="fa fa-spinner fa-spin fa-1x" style="text-align:center;display:block"></i>');
	
	
	$.ajax({
	    method : 'GET',
	    ContentType: 'application/json', 
	    url : baseURL +"/courses/" + courseID + "/lectures",
	    success: searchLecture,
	    error: searchLecture
	    });
	

});


$(document).on('click', '#clearButton', function(event)
		{
			event.preventDefault();
			$("#lectureGroups").empty();
			$("#searchText").val("");
			$('div[id="formError"]').empty();
		});

$(document).on('click', '#question', function(event)
		{
			event.preventDefault();
			var qid = $(this).attr("qid");
			sessionStorage.setItem("currQID", qid);
			var lectureID = $(this).attr("lectureid");
			var userID = sessionStorage.getItem("userID");
			sessionStorage.setItem("lectureID", lectureID);
			$.ajax({
			    method : 'GET',
			    ContentType: 'application/json', 
			    url : baseURL +"/results/" + lectureID + "/lecture/" + userID,
			    //url : baseURL +"/lecture/" + lectureID,
			    success: viewQuestionsCallback,
			    error: viewQuestionsCallback
			    })
		});

$(document).on('click', '#lectureGroup', function(event)
		{
			event.preventDefault();
			$("#modalBody").empty();
			$("#modalFooter").empty();
			$('div[id="formError"]').empty();
			//show loading image
			$("#loadBody").show();
			//reveal modal
			$("#myModal").modal('show');
			
			var lectureID = $(this).attr("lectureID");
			sessionStorage.setItem("lectureID", lectureID);
			var userID = sessionStorage.getItem("userID");
			var lectureTitle = $(this).attr("name");
			sessionStorage.setItem("lectureTitle", lectureTitle);
			sessionStorage.setItem("lectureName", lectureTitle);
			$("#modalTitle").empty();
			$("#modalTitle").append(lectureTitle);
			
			$.ajax({
			    method : 'GET',
			    ContentType: 'application/json', 
			    url : baseURL + "/results/" + lectureID +"/lecture/" + userID,
			    success: viewModalCallback,
			    error: viewModalCallback
			    });
		});

//Event for when enter button is clicked when search text box is selected
function enter(e)
{
	 if(e.keyCode === 13){
         $("#searchButton").click();
     }

     return false;
};

/**
 * callback for when the search button is clicked
 */
function searchLecture(result, error)
{
	if(error == "success")
	{
		//get text from search box
		var text = document.getElementById("searchText").value.toLowerCase();
		text = text.replace(/\s/g,'');
		
		var limit = 0;
		var data = window.allTagsData;
		
		for(var i = 0; i< result.Lectures.length && limit < 10; i++)
		{
			var name = result.Lectures[i].name.toLowerCase();
			name = name.replace(/\s/g,'');
			if(name.indexOf(text) !== -1)
			{
				limit++;
				var html = '<a class = "list-group-item" href="#" id="lectureGroup" lectureID = "'+result.Lectures[i].lectureId+'" name = "'+result.Lectures[i].name+'"><span class="glyphicon glyphicon-file"></span>'+result.Lectures[i].name+'</a>';
				$("#lectureGroups").append(html);
			}
		}
		//check tags names
		for(var i = 0; i< data.tags.length && limit < 100; i++)
		{
			var tag = data.tags[i].tagName;
			var name = tag.replace(/\s/g,'').toLowerCase();
			if(name.indexOf(text) !== -1)
			{
				limit++;
				console.log("tag name found");
				//getAllQuestionsWithTag(data.tags[i].tagId);
				
				var baseURL = sessionStorage.getItem("baseURL");
				var url = baseURL + "/question/"+data.tags[i].tagId+"/allEntries/name";
				//sessionStorage.setItem("tagName", data.tags[i].tagName);
				var obj = {"name" : name};
				//$.getJSON(url, JSON.stringify(q), getTaggedQuestionCallback);
				
				$.ajax({
			    	type: 'POST',
			    	url: 	url,
			    	data: JSON.stringify(obj),
			    	success: getTaggedQuestionCallback,
			    	error: getTaggedQuestionCallback,
			    	contentType: "application/json",
			    	dataType: 'json'
			});
				
			}
			
		}
		setTimeout(
				function searchEnd(){
						//change image of button
						$("#searchButton").empty();
						$("#searchButton").append('<i class="glyphicon glyphicon-search"></i>');
						//make button clickable after loading
						document.getElementById("searchButton").disabled = false;
						document.getElementById("clearButton").disabled = false;
						$("#lectureGroups").removeClass("hidden");
			}, 1000);
	}
	else
	{
		//
	}
};

/**
 * Callback to display tags for search
 */
function getTaggedQuestionCallback(result, error)
{
	if(error == "success")
		{
			var question = result;
			var lectureQuestions = JSON.parse(sessionStorage.getItem("lectureQuestions"));
			for(var j = 0; j < question.questions.length; j++)
			{
				//need courseID, not lectureID
				for(var k = 0; k < lectureQuestions.Lectures.length; k++)
					{
						if(lectureQuestions.Lectures[k].lectureId == question.questions[j].lec)
						{
							var name = question.questions[j].tagName;
							var html = '<a class = "list-group-item" href="#" id="question" qid = "'+question.questions[j].id+'" lectureID = "'+question.questions[j].lec+'" name = "tag"><div class="label label-info">'+name+'</div>  '+question.questions[j].name+'</a>';
							$("#lectureGroups").append(html);
							//break;
						}
					}
			}		
		}
};

$(document).ready(initialize());

var baseURL;

/**
 * Initialize the page
 */
function initialize()
{
	var courseID = sessionStorage.getItem("courseID");
	sessionStorage.setItem("currQID", null);
	baseURL = sessionStorage.getItem("baseURL");
	
	//used for Result page, have result page not default onto graph tab
	var isGraph = false;
	sessionStorage.setItem("isGraph",JSON.stringify(isGraph));
	
	$.ajax({
	    method : 'GET',
	    ContentType: 'application/json', 
	    url : baseURL +"/courses/" + courseID + "/lectures",
	    success: getLecture,
	    error: getLecture
	   });
};

/**
 * callback to display the calendar and lectures
 */
function getLecture(result, error)
{
	if(error == "success")
		{
		
			//save list of lectures for getting tag questions
			sessionStorage.setItem("lectureQuestions", JSON.stringify(result));
			//get all tags for search function
			getAllTags();
			
			//initialize calendar
			$("#calendar").fullCalendar({
				editable:true,
				timezone:'local', 
				eventClick:function(calEvent, jsEvent, view)
				{
					$("#modalBody").empty();
					$("#modalFooter").empty();
					
					//show loading image
					$("#loadBody").show();
					//reveal modal
					$("#myModal").modal('show');
					var lectureID = $(calEvent).attr("lectureID");
					var userID = sessionStorage.getItem("userID");
					sessionStorage.setItem("lectureID", lectureID);
					sessionStorage.setItem("lectureTitle", $(calEvent).attr("title"));
					sessionStorage.setItem("lectureName", $(calEvent).attr("title"));
					$("#modalTitle").empty();
					$("#modalTitle").append(calEvent.title);
					$.ajax({
					    method : 'GET',
					    ContentType: 'application/json', 
					    url : baseURL + "/results/" + lectureID +"/lecture/" + userID,
					    success: viewModalCallback,
					    error: viewModalCallback
					    })
				}
			
				});
			
			//add lectures to the calendar
			for(var i = 0; i< result.Lectures.length; i++)
				{
					var event = {title:result.Lectures[i].name, allDay:true, start:result.Lectures[i].publishDate,lectureID:result.Lectures[i].lectureId };
					$('#calendar').fullCalendar('renderEvent', event, true);
				}	
			
		}
	else
		{
			console.log("not working");
		}
};

/**
 * Create and display the modal for when a lecture is clicked
 */
function viewModalCallback(result, error)
{
	if(error == "success"){
		var publishedExist = false;
		var qs = result.lectureResults;
		var lid = sessionStorage.getItem("lectureID");
		$("#modalBody").empty();
		for(var i = 0; i < qs.length; i++)
			{
			//Check for publihsed questions and add them to modal
			if(qs[i] != null)
			{
				publishedExist = true;
				var points = 0;
				for(var j = 0; j < qs[i].results.length; j++)
					{
						for(var k = 0; k < qs[i].results[j].users.length; k++)
							{
								points = qs[i].results[j].users[k].points;
							}
					}
				$("#modalBody").append('<button type="button" lectureid ="'+lid+'"id="question" qid="'+qs[i].qID+'" class="btn btn-default" data-dismiss="modal" style="width:100%;"><span style="float:left">'+qs[i].title+'</span><span style="float:right">'+"Score : "+points+"/"+qs[i].value+'</span></button>');
			}
				
			}
		$("#modalFooter").empty();
		$("#modalFooter").append('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>');
		$("#modalFooter").append('<button type="button" id="lecture" class="btn btn-primary" data-dismiss="modal">Enter</button>');
		
		//Display message that there is no questions available
		if(qs.length == 0 || !publishedExist)
			{
				$("#modalBody").append('There is no "published" questions for this lecture available.');
				$("#modalFooter").empty();
				$("#modalFooter").append('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>');
			}
		
		//hide loading image
		$("#loadBody").hide();
	}
	else
		{
			//error message
			console.log("error in modal creation");
		}
};

/**
 * Event handler for when the enter button is clicked on the modal
 */
$(document).on('click', '#lecture', function(event)
		{
			event.preventDefault();
			var lectureID = sessionStorage.getItem("lectureID");
			var lectureTitle = sessionStorage.getItem("lectureTitle");
			console.log(lectureID);
			$.ajax({
			    method : 'GET',
			    ContentType: 'application/json', 
			    url : baseURL +"/lecture/" + lectureID,
			    success: viewQuestionsCallback,
			    error: viewQuestionsCallback
			    })
		});

function viewQuestionsCallback(result, error)
{
	if(error == "success")
		{
			if(result.lectureResults.length >= 0)
				{
				var qid = parseInt(sessionStorage.getItem("currQID"));
				var exist = false;
					for(var i = 0; i < result.lectureResults.length; i++)
						{
						if(result.lectureResults[i] != null)
							if(result.lectureResults[i].qID == qid && result.lectureResults[i].published)
								{
									
									exist = true;
									break;
								}
						}
					if(exist)
						{
						loadPage("result_student");
						}
					else
						{
						$('div[id="formError"]').empty();
		    			$('div[id="formError"]').html( generateAlert("<strong>The selected Question is not Published.</strong>.", 3) );
						}
					
				}
			else
				{
					console.log("no question in lecture");
					//give error notice that lecture holds no questions
				}
		}
	else
		{
			//if callback fails
		}
}

