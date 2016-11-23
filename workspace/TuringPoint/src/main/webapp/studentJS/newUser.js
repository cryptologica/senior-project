var Url = "http://student-145.coe.utah.edu:8110/TuringPoint/rest/";
var passType = "";
var gate = true;
var counter = 0;

	function signup() {
		var FName = event.target.fName.value;
		var LName = event.target.lName.value;
		var Email = event.target.email.value;
		var Pass = event.target.password.value;
		var Role = event.target.role.value;
		var id = event.target.studID.value;
		var q = {};
		if (Role == ("STUDENT")) {
			q = {"email" : Email, "password" : Pass, "role": Role, "studentid" : id, "fname" : FName, "lname" : LName};
			 $.ajax({
				    method : 'POST',
				    ContentType: 'application/json', 
				    url : Url+"users/create",
				    data : JSON.stringify(q),
				    dataType : 'json',
				    success: callback
				    });
		}
		else{
				q = {email : Email, password : Pass, role: Role, fname : FName, lname : LName};
				 $.ajax({
					    method : 'POST',
					    ContentType: 'application/json', 
					    url : Url+"users/create",
					    data : JSON.stringify(q),
					    dataType : 'json',
					    success: callback
					    });
			}		
	};

function callback(result, status)
{
	if(status == "success")
	{
		console.log("Everything is good so far");
	}
	else
	{
		alert(status);
	}
};


