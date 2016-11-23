<html>
<head>

	<!--  Libraries -->
	<script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
	<script src="./newJQueryUI/jquery-ui.min.js"></script>
     
     	<!--  Page-specific JS, add here for new pages -->
     <script src="./js/login.js" type="text/javascript"></script>
     <script src="./js/register.js" type="text/javascript"></script>

     	<!-- TODO: Only load user specific scripts upon login? -->
     <script src="./instructorJS/home.js" type="text/javascript"></script>
     <script src="./instructorJS/lectures.js" type="text/javascript"></script>
     <script src="./instructorJS/quiz.js" type="text/javascript"></script>
     <script src="./instructorJS/resultsMgmt.js" type="text/javascript"></script>
     <script src="./js/sidebar.js" type="text/javascript"></script>
     
     <!-- Stylesheets -->
     <link rel="stylesheet" href="./jqueryUI-custom/jquery-ui.min.css">
     <link rel="stylesheet" href="./css/style.css"/>
     <link rel="stylesheet" href="./css/pollsPage.css"/>
     
     <!-- For tab icon, fixes favicon.ico error -->
     <link rel="shortcut icon" href="./img/Logo.png" type="image/x-icon">
      
      <!-- Student stuff -->
     <script src="./studentJS/homepage.js"></script>
     <script src="./studentJS/takeQuiz.js"></script>  
     
    <script>
    
    // Main document starting function
    $(document).ready(function() {
    	
    	// Set the base session variables
    	setBaseSessionVars();
    	
    	// Fetch userId from the session storage
    	var userID = sessionStorage.getItem('userID');
    	
    	// Redirect to login if no userID
    	var currPage = sessionStorage.getItem('currPage');
    	if (userID == null) {
    		if (currPage == "register") {
    			loadPage("register");
    		}
    		else {
    			loadPage("login");
    		}
    	}
    	// Or if currPage isn't set
    	else if (currPage == null) {
    		loadPage("login");
    	}
    	// Otherwise redirect to appropriate page
    	else {
    		var role = sessionStorage.getItem('role');
    		var currPage = sessionStorage.getItem('currPage');
    		// If they refresh, ensure same page reloaded
    		if (currPage != null && role != null) {
    			// If it has a special html tag thing, going to have to special reload it here
    			if (currPage == 'quiz' && role == 'INSTRUCTOR') {
    				loadQuestionsAndPage(1, "quiz");
    			}
    			else if (currPage == 'takeQuiz' && role == 'STUDENT') {
    				loadQuestionsAndPage(3, "takeQuiz");
    			}
    			else {
    				loadPage(currPage);
    			}	
    		}
    		else if (role == "INSTRUCTOR") {
    			loadPage("home");
    		}
    		else if (role == "STUDENT") {
    			loadPage("homepage");
    		}
    		else {
    			loadPage("login");
    		}	
    	}
	});
    
	// When click "Logout"
	$(document).on('click', '#logout', function(event) {
		sessionStorage.clear();
		setBaseSessionVars();
		loadPage("login");
	});
	
	// When click "Register"
	$(document).on('click', '#registerButton', function(event) {
		loadPage("register");
	});
	
	// When click "Home", on NavBar
	$(document).on('click', '#homeLink', function(event) {
		loadPage("home");
	});
	// When click "Lectures", on NavBar
	$(document).on('click', '#lecturesLink', function(event) {
		loadPage("lectures");
	});
	// When click "Play/Edit", on NavBar
	$(document).on('click', '#quizLink', function(event) {
		loadQuestionsAndPage(1, "quiz");
	});
	// When click "Students", on NavBar (student management)
	$(document).on('click', '#studentMgmtLink', function(event) {
		loadPage("studentMgmt");
	});
	
    //When click "Home" on nav bar for student
    $(document).on('click', '#homepageLink', function(event){
    	loadPage("homepage");
    });
    
   //When click "Quiz" on nav bar for student
    $(document).on('click', '#studentQuizLink', function(event){
    	loadQuestionsAndPage(3, "takeQuiz");
    });
   
 // When click "Students", on NavBar (student management)
	$(document).on('click', '#resultsMgmtLink', function(event) {
		loadPage("resultsMgmt");
	});
   
   //resultsMgmtLink
    
	/*
	* Call this onload and after clearing the session.
	*/
	function setBaseSessionVars() {
    	sessionStorage.setItem('baseURL', '/TuringPoint/rest');
    	sessionStorage.setItem('isProduction', true);
	}
	
    /*
     * Call to replace the contents of the main page. Pass in the "page" name (without .html extension) with
     * the viewType (either: "student", "instructor" or "main"). You don't actually have to pass "main".
     * It just defaults if not a student or instructor. It's just for readability purposes.
     */
    function loadPage(page){
    	loadPageHelper(page, "pageContent");	// Pass to helper method below to dump to main page
    }
    
    /*
     *	Helper method for loading a page, works the same as before but lets you specify the
     *  HTML ID to dump the page to
     */
    function loadPageHelper(page, htmlID){
    	var role = sessionStorage.getItem('role');
    	var viewType = "";
    	if (role != null) {
    		viewType = role.toLowerCase();
    	}
    	var pageURL = "";
    	// Change URL if loading a student page...
    	if (viewType == 'student') {
    		pageURL = "./studentView/" + page + ".html";
    	}
    	// Or instructor page
    	else if (viewType == 'instructor') {
    		pageURL = "./instructorView/" + page + ".html";
    	}
    	// Otherwise...
    	else {
    		var pageURL = "./views/" + page + ".html";
    	}
    	// Get the HTML from the server
    	$.get(pageURL, function(data) {
    		// alert( "got data: " + data);
    		
        	// Set the HTML for the page
        	$("#" + htmlID).empty();
        	$("#" + htmlID).html(data);
    		
    		// Set current page user is on
    		sessionStorage.setItem('currPage', page);	
    		
    		// Document is now loaded, do any initializations for page
    		callPageInitMethod(page);
    		
    		// Update the navigation bar for page
    		loadNavbar(page);
    	});
    }
    
    /**
     * Since we are injecting the HTML you cannot use $(document).ready(...).
     * Anything you'd put in there, place in here for the respective page.
     */
   function callPageInitMethod(page) {
     	var role = sessionStorage.getItem('role');
     	var viewType = "";
    	if (role != null) {
    		viewType = role.toLowerCase();
    	}
    	if (viewType == 'student') {
       		if(page == 'homepage')
       		{
       			initialize(page);
       			$('#add').button();
       		}
       		
       		if(page == 'takeQuiz')
       		{
       			initializeQuiz(page);
       		}
     	}
    	else if (viewType == 'instructor') {
         	if (page == 'home') {
         		initCreateForm();
         		initCourses();
         		$('#add-course').button();
         	}
         	if (page == 'lectures') {
         		initLectures_Lectures();
         		initLectureForm();
         		$('button').button();
         	}
         	if (page == 'quiz') {
         		sessionStorage.setItem("currQuestion", null);
         		initHideOtherQTypes();
         		initializeQuizStyles();
         		$('button').button();
         	}
         	
         	if (page == 'resultsMgmt') {
         		initializeResultsMgmt();
         	}
         	if (page == 'studentMgmt') {
         		
         	}
     	}
    	else {
    		if (page == 'login') {
    			initLoginPage();
    		}
    		if (page == 'register') {
    			$('#submitRegistration').button();
    			$('#cancelButton').button();
    		}
    	}
   }
    
    /**
      *	Call to inject a page with questions on the left-hand side, and the question's content on the right-hand side.
      * pageType: 1 = Instructor view/edit polls page
      *			  2 = Instructor view poll results page
      *			  3 = Student take poll page
      *			  4 = Student view poll results page
      * TODO: Update pageType during next phase to detect correct page based on session variables
      */
    function loadQuestionsAndPage(pageType, page){
    	// Get the HTML from the server
    	var pageURL = "./views/sidebar.html";
    	$.get(pageURL, function(data) {		// Inject the sidebar html
    		
    		// Set the HTML for the page
    		$("#pageContent").empty();
    		$("#pageContent").html(data);
    		
    		if(pageType == 1){	// Instructor view/edit polls page
    			initAllQuestionsInstrQuiz();	// Special function for instr. quiz page
    			
    		} else if (pageType == 2){	// Instructor view poll results page
    			// TODO: Convert to initialize with empty question if there are no results
    			// TODO: Add button with this type so that more questions can be added
    			initAllQuestions();
    		} else if (pageType == 3){	// Student take poll page
    			
    			initAllActiveQuestions();	// Method on sidebar.js to initialize all active lecture questions
    			
    		} else if (pageType == 4){	// Student view poll results page
    			
    		} else{
    			alert("You've requested an invalid page type.");
    			return;
    		}
    		updateQuestionPageBody(page);	// Append right-hand side body
    	});
    }
    
   /**
     * Call to update the right-hand side of the split questions page
     */
    function updateQuestionPageBody(page){
    	loadPageHelper(page, "mainPage");	// Call helper method in file inject to the right-hand side of polls page
    	
    	// TODO: Depending on instructor or student: if a question is available default to it and load the contents.
    	// If an instructor poll page has no questions, load a default.
    }
    
    
    /**
     * Set the contents of the main navigation bar. Called after page is loaded.
     */
    function loadNavbar(page) {
     	var role = sessionStorage.getItem('role');
     	var viewType = "";
    	if (role != null) {
    		viewType = role.toLowerCase();
    	}
    	var navbarContent = "";
      	if (viewType == 'student') {
      		if(page == 'homepage'){
      			navbarContent = '<a id="homepageLink">Home</a>';
      		}
      		if(page == 'takeQuiz')
      		{
      			navbarContent = '<a id="homepageLink">Home</a>&gt;<a id = "studentQuizLink">Quiz</a>';
      		}
    	}
    	else if (viewType == 'instructor') {
        	if (page == 'home') {
        		navbarContent = '<a id="homeLink">Home</a>';
        	}
        	if (page == 'lectures') {
        		navbarContent = '<a id="homeLink">Home </a>&gt;<a id="lecturesLink"> Lectures</a>';
        	}
        	if (page == 'quiz') {
        		navbarContent = '<a id="homeLink">Home </a>&gt;<a id="lecturesLink"> Lectures</a>&gt;<a id="quizLink"> Play/Edit</a>';
        	}
        	if (page == 'studentMgmt') {
        		navbarContent = '<a id="homeLink">Home </a>&gt;<a id="studentMgmtLink"> Students</a>';
        	}
        	if (page == 'resultsMgmt') {
        		navbarContent = '<a id="homeLink">Home </a>&gt;<a id="resultsMgmtLink"> Results</a>';
        	}
    	}
    	else {
    		
    	}
      	
    	// Sets user info under their picture
    	var currUser = sessionStorage.getItem('currUser');
    	if (currUser != null) {
    		var userInfoContent = currUser + ' | <a id="logout">Logout</a>';
    		$('#userInfo').empty();
        	$('#userInfo').html(userInfoContent);
    	}
    	else {
    		$('#userInfo').empty();
        	$('#userInfo').html('Welcome! Please login.');
    	}
  	
		// If user id empty, clear the navbar
		var userID = sessionStorage.getItem('userID');	
    	if (!userID) {
    		navbarContent = "";
    	}
    	
    	// Set the navbar
    	$('.navBarClass').empty();
    	$('.navBarClass').html(navbarContent);
    }
    
    </script>
</head>
<body>

		<header>
		<div id="headerContent">
			<img id="logo" src="./img/Logo.png">
			<div id="picInfoContainer" align="right">
			    <img id="profilePic" src="./img/userIcon.png">
				<p id="userInfo">
				</p>
			</div>
			<ul id = "menuContainer">
				<li id="inline" class="navBarClass">
				<!-- navigation bar content injected here -->
				</li>
			</ul>
		</div>
	</header>
	
	<!-- main page content injected here -->
	<div id="pageContent"></div>
		
</body>
</html>
