function fillInPollPresentationInfo(presentationMode){
	fillPresentationHelper(presentationMode, false)
}

/**
 * For the presentation modal
 * @param presentationMode
 */
function fillInPollPresentationPreviewInfo(presentationMode){
	fillPresentationHelper(presentationMode, true)
}

function fillPresentationHelper(presentationMode, previewMode){
	var data;
	var content
	if(!presentationMode)
		data= window.currentQuestionData;
	else
		data = presentationcurrentQuestionData;
	
	//console.log(presentationMode)
	//console.log(data)
	
	var table = "#presentationTable" + (previewMode ? "Preview" : "");
	var text = "#presentationText" + (previewMode ? "Preview" : "");
	var title = "#presentationTitle" + (previewMode ? "Preview" : "");
	var response = "#responseText" + (previewMode ? "Preview" : "");
	
	//try
	//{
		$(table).css("visibility", "hidden");
		$(text).css("visibility", "hidden");
		$(table).find(".generatedTableRow").remove();
		$(title).html(data.title);
		content = data.content;
		
		//PRe process the content and look for tags to dictate if we add stuff
		$(text).html(content);
		
		$(text + " > pre").each(function() {$(this).addClass("line-numbers"); })
		
		//force prism to re highlight
		//Prism.highlightElement(text);
		Prism.highlightAll();
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,"presentationText" + (previewMode ? "Preview" : "") ], function(){$(text).css("visibility", "")});
		if (data.type == 0 || data.type==2) {
			tableHTML ="";
			
			for(var i = 0; i < data["options"].length; i++)
			{
		
				tableHTML += "<tr class=\"generatedTableRow\"><td><span class=\"presentBullet\"></span>"+data["options"][i]["text"]+"</td></tr>";
			}
			
			$(table).append(tableHTML);
			$(response).html("Choose the most correct response");
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,"presentationTable" ], function(){$(table).css("visibility", "")});
			
		}
		else if (data.type == 1) {
		
			$(response).html("Please give a short answer")
		}
		
		else if (data.type == 3) {
			
			$(response).html("Please give a numeric response")
		}
		
		redrawFontSizeButtonsAndPresentationFonts();
		return true;
		
		/*
	}
	catch(exception)
	{
		console.log("failed to load: " + exception );
		return false;
	}*/
}

function redrawFontSizeButtonsAndPresentationFonts()
{
	try{
		if(window.presentationFontSize > 0)
		{
			$('#minusFont').show();
		}
		else if(window.presentationFontSize == 0)
		{
			$('#minusFont').hide();
		}
		
		if(window.presentationFontSize < 6)
		{
			$('#plusFont').show();
		}
		else if(window.presentationFontSize == 6)
		{
			$('#plusFont').hide();
		}
	}
	catch(exception)
	{
		
	}
	
	//console.log(window.presentationFontSize)
	
	var presentationFontSizes = {};
	presentationFontSizes[0]='xx-small';
	presentationFontSizes[1]='x-small';
	presentationFontSizes[2]='small';
	presentationFontSizes[3]='medium';
	presentationFontSizes[4]='large';
	presentationFontSizes[5]='x-large';
	presentationFontSizes[6]='xx-large';
	
	
	
	$("#presentationTitle").css("fontSize", presentationFontSizes[window.presentationFontSize]);
	$("#presentationText").css("fontSize", presentationFontSizes[window.presentationFontSize]);
	$("#presentationText > pre > code").css("fontSize", presentationFontSizes[window.presentationFontSize]);
	if(window.presentationFontSize > 3)
	{
		$("#presentationTitle").css("fontWeight", "bolder");
		$("#presentationText").css("fontWeight","bolder");
		$("#presentationText > pre > code").css("fontWeight","normal");
	}
	else
	{
		$("#presentationTitle").css("fontWeight", "normal");
		$("#presentationText").css("fontWeight","normal");
	}
	$("#responseText").css("fontSize", presentationFontSizes[window.presentationFontSize]);
	$(".generatedTableRow").css("fontSize", presentationFontSizes[window.presentationFontSize]);
	$(".preformat").css("fontSize", presentationFontSizes[window.presentationFontSize]);
	
	//if(window.presentationWindow != null)
	//	window.presentationWindow.$(window.presentationWindow.document).trigger("fontChange");
	
}