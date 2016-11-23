$(document).ready(function() {

	//console.log("winner")
	$(".viscontent").hide();

	var role = sessionStorage.getItem('role');
	var baseURL = sessionStorage.getItem("baseURL");


	//get student list from parent
	window.studentList = parent.studentList;
	
	window.isResultsExplorer = true;
	getAllTags();
	
	window.currentlySelectedTags = {};
	
	////for tag exploring
	$(document).on('click', '.tagClose', function(event) {
		untagClickHandler(this)
		
	});
	$(document).on('click', '.tptag',function(event){
		tagClickHandler(this)
	});
	$(document).on('click', '.collapsyRow2',function(event){
		goToExplorationTab(this)
	});
	
	//When clicking on a row in the table....
	$(document).on('click', ".generatedTableRow.clickableTableRow.optionRow", function(event)
	{
	    var rowID = $(this).attr("rowid");
	    //console.log();
	    var optionText = $(this).find(".optionname").text()
	    var correct = $(this).hasClass("pollCorrectAnswer");
	    encaseUsersAndMakeTheTable(inquisition(rowID),optionText,correct);
	    //console.log(users);
	});

});