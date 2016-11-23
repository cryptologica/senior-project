
var id = "";
var pass = "";
var Url = "http://localhost:8080/TuringPoint/rest/login";
var authenticated;

	function authenticate() {
	id = document.getElementById("ids").value;
	pass = document.getElementById("password").value;
	document.getElementById("ids").value = "";
	document.getElementById("password").value = "";
	var q = {"email": id,"password": pass};
	
	 $.ajax({
	    method : 'POST',
	    ContentType: 'application/json', 
	    url : Url,
	    data : JSON.stringify(q),
	    dataType : 'json',
	    success: callback,
	    error : error
	    });
	 return false;
	};

function error(err)
{
	console.log("failure");
	alert(err.responseText);
};

function callback(result)
{
	console.log("success");
		var userid = parseInt(result.userId);
		var fname = result.fname;
		var lname = result.lname;
		sessionStorage.setItem("userid", userid);
		sessionStorage.setItem("fname", fname);
		sessionStorage.setItem("lname", lname);
};
