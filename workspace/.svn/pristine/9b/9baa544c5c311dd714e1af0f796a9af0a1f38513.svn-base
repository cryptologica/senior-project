function getAllTags()
{
	
	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/question/alltags";

	$.getJSON(url, getAllTagsCallback);

}

function getAllTagsCallback(data,status)
{
	if(status == "success"){
		
		console.log(data)
		window.allTagsData = data;
		
		if(window.initTagUI)
		{
			finalizeTaggingUI();
		}
		if(window.isResultsExplorer)
		{
			setupExplorerTags(data)
		}
		
		return data;
		
	}
	return null;
}

function getLectureTags(lectureID,tagMode)
{
	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/question/"+lectureID+"/lectureTags";

	window.setLectureTagsRetreiving = true;
	window.lectureTagRetreivalMode = tagMode;
	
	
	if(window.lectureTagData == null)
		{
		window.lectureTagData = {};
		}
	
	$.getJSON(url, getLectureTagsCallback);
}

function getLectureTagsCallback(data,status)
{
	if(status == "success"){
		//console.log(data);
		//categorize this by lecture id
		window.lectureTagData[data["lec"]] = data;
		
		if(window.setLectureTagsRetreiving)
		{
			window.totalLecturesToRetrieve--; // set this value before call
			
			//only stop doing this if all lectures are g0t
			if(window.totalLecturesToRetrieve == 0)
				window.setLectureTagsRetreiving = false;
			
			if(window.lectureTagRetreivalMode == 1)
			{
				renderLectureTagQbQ(data["lec"]);
			}
		}
		
		return data;
		
	}
	return null;
}

function renderLectureTagwell(container)
{
}

function renderLectureTagQbQ(correlation)
{
	//find a div with the correct correlation id on manage students
	console.log(window.lectureTagData[correlation]);
	var correlation = window.lectureTagData[correlation]["lec"];
	var tagData = window.lectureTagData[correlation]["tags"];
	
	var targetBox = $("#studentResultsInfoDiv").find("[correlation='"+correlation+"']");
	var questionHome;
	
	for(var i = 0; i < tagData.length; i++)
	{
		var qID = tagData[i]["qid"];
		var taggy = tagData[i]["tags"];
		
		questionHome = targetBox.find(".questionCollection").find("[qid='"+qID+"']");
		
		var willow = questionHome.find(".tagwell");
		willow.each(function()
		{
			$(this).empty();
		});
		for(var j = 0; j < taggy.length; j++)
		{
			willow.each(function()
			{
				renderTagWithoutClosure($(this),taggy[j]["tagName"],taggy[j]["tagId"])
			});
		}
	}
}

function getQuestionTags(questionId)
{
	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/question/" + questionId +"/tags";

	$.getJSON(url, getQuestionTagsCallback);
}

function getQuestionTagsCallback(data,status)
{
	if(status == "success"){
		
		console.log(data)
		
		if(window.renderingTagsForQuestion)
		{
			window.renderingTagsForQuestion = false;
			renderTagsForQuestionCallback(data);
		}
		
		return data;
		
	}
	return null;
}

function getQuestionTags(questionId)
{
	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/question/" + questionId +"/tags";

	$.getJSON(url, getQuestionTagsCallback);
}

function getQuestionTagsCallback(data,status)
{
	if(status == "success"){
		
		console.log(data)
		
		if(window.renderingTagsForQuestion)
		{
			window.renderingTagsForQuestion = false;
			renderTagsForQuestionCallback(data);
			
		}
		
		return data;
		
	}
	return null;
}

function tagQuestion(qid,tagId,tagName)
{
	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/question/"+qid+"/tag";

	//$.getJSON(url, getAllTagsCallback);
	
	var request = {};
	request["tagId"] = tagId;
	request["tagName"] = tagName;
	
	$.ajax({
		  method: "POST",
		  url: url,
		  contentType: "application/json",
		  data: JSON.stringify(request),
		  complete: tagQuestionCallback
	});
}

function storeTagForQuestionCreation(tid,tagname)
{
}

function tagQuestionCallback(data,status)
{
	if(status == "success"){
		
		console.log(data)
		if(window.tagInProgress && window.ResultQuestionID != null)
		{
			window.multiTagInProgress = window.multiTagInProgress -1;
				
			if(window.multiTagInProgress == 0)
			{
				window.tagInProgress = false;
				renderTagsForQuestion(window.ResultQuestionID);
				//renderTag("#tagwell",window.targetTagName,data["tagId"]);
			}
		}
		
		
		return data;
		
	}
	return null;
}

function unTagQuestion(qid,tagId)
{
	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/question/"+qid+"/untag/" + tagId;

	//$.getJSON(url, getAllTagsCallback);

	var request = null;
	
	$.ajax({
		  method: "POST",
		  url: url,
		  contentType: "application/json",
		  data: JSON.stringify(request),
		  complete: unTagQuestionCallback
	});
}

function unTagQuestionCallback(data,status)
{
	if(status == "success"){
		
		console.log(data)
		
		
		if(window.untagInProgress)
		{
			removeTag(window.choppingBlockTag);
			window.untagInProgress = false;
		}
		
		return data;
		
	}
	return null;
}

function createTaggingUI(container)
{

	window.tagUIcontainer=container;
	window.initTagUI = true;
	getAllTags();
	
}

function finalizeTaggingUI()
{
	var guiHTML = ''+
	'<div id="taggingUI" class="panel-default">'+
		'<div class="row panel-body">'+
			'<div class="col-md-6">'+
				'<a data-original-title="All tags are created in lower case. When entering multiple tags, spaces or commas seperate tags. Tag names longer than 45 characters are ignored." data-toggle="tooltip" data-placement="top" title=""> <span class="glyphicon glyphicon-question-sign"></span></a>'+
		    	'<label> Correctness</label>'+
				'<div id="tagInput">'+
				    '<div class="input-group col-md-12">'+
				        '<input id="taginput" class="search-query form-control" placeholder="Search" type="text">'+
				        '<span class="input-group-btn">'+
				            '<button class="btn btn-danger" type="button">'+
				                '<span class=" glyphicon glyphicon-search"></span>'+
				            '</button>'+
				       ' </span>'+
				    '</div>'+
				'</div>'+
			'</div>'+
			'<div class="col-md-6">'+
				'<label>Current Tags</label>'+
				buildTagWell()
			'</div>'+
		'</div>'+
	'</div>';
	
	window.initTagUI = false;
	$(window.tagUIcontainer).append(guiHTML);
	
	$("body").tooltip({
	    selector: '[data-toggle="tooltip"]'
	});

	
	//Add event handlers
	$('#taginput').on('keypress', function (event) {
        if(event.which === 13){

        	tagUIInputFinished($('#taginput').val());
        }
	});
}

function buildTagWell(size,moniker)
{
	if(size = "sm")
	{
		return '<div class="well sm tagwell '+moniker+'">'+
		"<div class='block text-center'><span class='fa-spin fa fa-refresh fa-2x'></span></div>"+
		'</div>';
	}
	return '<div class="well tagwell '+moniker+'">'+
	"<div class='block text-center'><span class='fa-spin fa fa-refresh fa-5x'></span></div>"+
	'</div>';
	
}

function renderTagsForQuestion(qid)
{
	window.renderingTagsForQuestion = true;
	$(".tagwell").each(function(){$(this).empty()});
	getQuestionTags(qid);
}

function renderTagsForQuestionCallback(data)
{
	for(t in data["tags"])
	{
		renderTag(".tagwell",data["tags"][t]["tagName"],data["tags"][t]["tagId"])
	}
}

function tagUIInputFinished(inputString)
{
    //Disable textbox to prevent multiple submit
    $('#taginput').attr("disabled", "disabled");
    //make commas into spaces for parsing purposes
    inputString = inputString.replace(","," ");
    
    //truncate all multiple spaces into single spaces
    //credit for this regex goes to http;//http://stackoverflow.com/questions/1981349/regex-to-replace-multiple-spaces-with-a-single-space
    inputString = inputString.replace(/ +(?= )/g,'');
    
    //break the user input into tags via spaces
    var tagArray = inputString.split(" ");
    console.log("user submitted tag!")
    
    for(s in tagArray) 
    {

    	window.multiTagInProgress = tagArray.length;
    	var tagName = tagArray[s]
    	
    	if(tagName.length > 0 && tagName.length < 46)
		{
	    	console.log(tagName);
	    	var tagId = -1; // assume this is a new tag
	    	
	    	for(t in window.allTagsData["tags"])
    		{
    			var wig = window.allTagsData["tags"][t]["tagName"];
    			if(tagName.toLowerCase() == window.allTagsData["tags"][t]["tagName"])
				{
					tagId = window.allTagsData["tags"][t]["tagId"];
					console.log("creating existing tag");
				}
    		}
	    	generateTag(tagArray[s],tagId);
		}
    }
    
    //re enable the box now
    $('#tagInput').val('');
    $('#taginput').removeAttr("disabled");
}

function generateTag(tagname,tagid)
{
	var qid = window.ResultQuestionID;
	window.targetTagName = tagname;
	window.targetTagid = tagid;
	window.tagInProgress = true;
	if(qid !=  null)
	{
		tagQuestion(qid,tagid,tagname);
	}
}

function renderTagWithoutClosure(container,tagname,tagid)
{
	renderTagCore(container,tagname,tagid,1);
}

function renderTag(container,tagname,tagid)
{
	renderTagCore(container,tagname,tagid,0);
}

function renderTagCore(container,tagname,tagid,mode)
{
	var taghtml;
	if(mode == 0 )
	{
		taghtml = '<div class="row"><div tagid='+tagid+' class="label label-info tptag" data-toggle="modal" data-target="#resultsExplorerModal">'+tagname+'<span role="button" class="glyphicon glyphicon-remove tagClose"></span></div></div>';
		$(container).each(function(){$(this).append(taghtml)});
	}
	else if(mode == 1)
	{
		taghtml = '<div class="row"><div tagid='+tagid+' class="label label-info tptag" data-toggle="modal" data-target="#resultsExplorerModal">'+tagname+'</div></div>';
		container.each(function(){$(this).append(taghtml)});
	}
}

function removeTag(tag)
{
	$(tag).parent().remove();
	console.log("closed tag");
}

function getAllQuestionsWithTag(tagId)
{
	var baseURL = sessionStorage.getItem("baseURL");
	var url = baseURL + "/question/"+tagId+"/allEntries";

	$.getJSON(url, getAllQuestionsWithTagCallback);
}

function getAllQuestionsWithTagCallback(data,status)
{
	if(status == "success"){
		
		window.questionsWithGivenTag = data;
		console.log(data)
		
		
		if(window.isResultsExplorer)
		{
			renderExplorerQuestionFindings(data);
		}
		
		return data;
		
	}
	//console.log("failed like a derp");
	console.log(data)
	return null;
}

function addTagExplorerToPage(container)
{
	var tagExplorerModalHTML = ''+
	'<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog">'
		'<div class="modal-header">'+
			'<button type="button" class="close" data-dismiss="modal">×</button>'+
				'<h3>Dialog</h3>'+
		'</div>'+
		'<div class="modal-body">'+
	      '<iframe id="resultsExplorerFrame" src="" style="zoom:0.60" frameborder="0" height="250" width="99.6%"></iframe>'+
		'</div>'+
		'<div class="modal-footer">'+
			'<button class="btn" data-dismiss="modal">OK</button>'+
		'</div>'+
	'</div>';
	
	$(container).append(tagExplorerModalHTML);
	//$('#resultsExplorerFrame').attr("src",frameSrc);
}

function untagClickHandler(source,event)
{
	if(!window.untagInProgress)
	{
		var qid = window.ResultQuestionID;
		window.choppingBlockTag = source;
		window.untagInProgress = true;
		var tagId = $(source).parent().attr('tagid');
		unTagQuestion(qid,tagId);
		
	}
	event.stopPropagation();
}

function openTagExplorer(source)
{
	var tagId = $(source).attr('tagid');
	var name = $(source).text();
	console.log("clicked open explorer tag: " + tagId + " with name: " + name);
	window.selectedExploreTag = tagId;
	
	
	$("#resultsExplorerFrame").attr("src","resultsExplorer.html?itag="+tagId);
	
}

function tagClickHandler(source)
{
	var tagId = $(source).attr('tagid');
	var name = $(source).text();
	console.log("clicked explory tag: " + tagId + " with name: " + name);
	window.selectedExploreTag = tagId;
	
	selectTagToExplore(tagId,name);
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//////////   Custom stuff for use in the results explorer only //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
function setupExplorerTags(data)
{
	var initialTag = $.query.get('itag');
	var initialTagName = "";
	console.log("itag: " +initialTag);
	
	renderExplorerTagPool(data);
	
	//check if the tag in the initial tag field exists, if so load questions with this tag after loading
	//otherwise change to the last tag in the list
	
	var foundTag = false;
	var tname = "None";
	var tid = -1;
	for(t in data["tags"])
	{
		tname = data["tags"][t]["tagName"];
		tid = data["tags"][t]["tagId"];
		
		if(tid == initialTag)
		{
			console.log("found "+t+" tag: " + tid + " " + tname);
			
			foundTag = true;
			initialTagName = tname;
			break;
		}
	}
	
	if(foundTag)
	{
		window.exploredTagId = tid;
		window.exploredTagName = tname;
		selectTagToExplore(tid,tname);
	}
	
}
function selectTagToExplore(tid,tagname)
{
	//hide the vis panel and clear it, show the navipanel
	$(".viscontent").hide();
	$(".viscontent").empty();
	$(".navicontent").show();
	
	//Empty the navicontent
	$('.navicontent').empty();
	$('.browsycontent').empty();
	$('.infocontent').empty();
	$('.navicontent').append("<span class='fa-spin fa fa-refresh fa-2x'></span>")
	
	//Change the selected tag
	$(".tagselect").empty();
	renderTagWithoutClosure($(".tagselect"),tagname,tid);
	getAllQuestionsWithTag(tid)
}
function renderExplorerTagPool(data)
{
	$(".tagpool").empty();
	for(t in data["tags"])
	{
		renderTagWithoutClosure($(".tagpool"),data["tags"][t]["tagName"],data["tags"][t]["tagId"]);
	}
}
function renderExplorerQuestionFindings(data)
{
	$('.navicontent').empty();
	
	$('.browsycontent').html("<h2>Matching Questions</h2>")
	$('.infocontent').html("<i>Click on a question to get more information about that question's results</i>")
	
	if(data["questions"].length > 0)
	{
		$('.navicontent').append("<div class='row'><div class='col-xs-4 text-center'><label>Name</label></div><div class='col-xs-8 text-center'><label>Lecture</label></div></div>")
		for(q in data["questions"])
		{
			$('.navicontent').append(getExplorerQuestion(data["questions"][q]["id"],data["questions"][q]["name"],data["questions"][q]["lecname"])+"")
		}
	}
	else
	{
		
		$('.navicontent').append('<div><div class="jumbotron"><h1>No questions with this tag</h1><p>There are currently no questions with this tag, use the results manager to tag questions</p></div></div>')
	}
	//console.log("did fake construction")
}

function goToExplorationTab(source)
{
	
	$(".navicontent").hide();
	$(".viscontent").empty();
	$(".viscontent").show();
	$('.browsycontent').empty();
	$('.infocontent').empty();

	$('.infocontent').append("<span class='fa-spin fa fa-refresh fa-2x'></span>");
	
	var id = $(source).attr("qid");
	var html = '<div id="contentHolder" class="row"></div><div class="row"><div class="col-md-12"></div></div>';
	console.log("browsing id: " + id);
	$(".viscontent").append(html);
	selectQuestion(id);
}

function nameStuffInExplorer(data)
{
	$('.infocontent').empty();
	$('.browsycontent').html("<h2>"+data["title"]+"</h2>");
	$('.infocontent').empty();
}

function getExplorerQuestion(id,name,lecture)
{
	//return "<div class='btn btn-default' role='btn' qid='"+id+"' lec='"+lecture+"' >"+name+"</div>";
	return 	"<div class='row collapsyRow2 clickableTableRow' qid='"+id+"' lec='"+lecture+"' >"+
				"<div class='col-xs-4 text-center'>"+
				name+
				"</div>"+
				"<div class='col-xs-8 text-center'>"+
				lecture+
				"</div>"+
			"</div>";
}