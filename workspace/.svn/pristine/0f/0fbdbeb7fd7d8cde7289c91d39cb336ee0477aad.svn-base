// Do when document loads
$(document).ready(function() {
	// Default is student role, so hide access code on initialization
	$('.access-code').hide();
	
	// When click "Submit" (for registration)
	$(document).on('click', '#registerBtn', function(event) {
		
		event.preventDefault();
		
		$('#registrationSpinner').removeClass('hidden');
		$('#registerBtn').addClass('disabled');
		
		var valid = true;
		var FName = $('input[name="fName"]').val();
		var LName = $('input[name="lName"]').val();
		var Email = $('input[name="email"]').val();
		var Pass = $('input[name="password"]').val();
		var PassConfirm = $('input[name="passwordConfirm"]').val();
		var Role = $('#rolePills .active').attr('role');
		var StudentID = $('input[name="studID"]').val();
		var AccessCode = $('input[name="accessCode"]').val();

		var url = sessionStorage.getItem("baseURL") + "/users/create";

		if (FName == "") {
			var alert = generateAlertNonDismiss("First name cannot be empty", '', 4);
			$('#fNameError').html(alert);
			$('input[name="fName"]').parent().addClass('has-error');
			valid = false;
		} else {
			$('input[name="fName"]').parent().removeClass('has-error');
			$('#fNameError').html('');
		}
		if (LName == "") {
			var alert = generateAlertNonDismiss("Last name cannot be empty", '', 4);
			$('#lNameError').html(alert);
			$('input[name="lName"]').parent().addClass('has-error');
			valid = false;
		} else {
			$('input[name="lName"]').parent().removeClass('has-error');
			$('#lNameError').html('');
		}
		if (Email == "" || !validateEmail(Email)) {
			var message = !validateEmail(Email) ? "Email format is invalid" : "Email cannot be empty";
			var alert = generateAlertNonDismiss(message, '', 4);
			$('#emailError').html(alert);
			$('input[name="email"]').parent().addClass('has-error');
			valid = false;
		} else {
			$('input[name="email"]').parent().removeClass('has-error');
			$('#emailError').html('');
		}
		
		$('input[name="passwordConfirm"]').parent().removeClass('has-error');
		$('input[name="password"]').parent().removeClass('has-error');
		if (Pass == "") {
			var alert = generateAlertNonDismiss("Password cannot be empty", '', 4);
			$('#passwordError').html(alert);
			$('input[name="password"]').parent().addClass('has-error');
			valid = false;
		} else {
			$('#passwordError').html('');
		}
		
		if (PassConfirm == "") {
			var alert = generateAlertNonDismiss("Password confirmation cannot be empty", '', 4);
			$('#passwordConfError').html(alert);
			$('input[name="passwordConfirm"]').parent().addClass('has-error');
			valid = false;
		} else {
			$('#passwordConfError').html('');
		}
		
		if(Pass !== PassConfirm){
			$('input[name="password"]').parent().addClass('has-error');
			$('input[name="passwordConfirm"]').parent().addClass('has-error');
			var alert = generateAlertNonDismiss("Passwords do not match", '', 4);
			$('#passwordMatchError').html(alert);
			valid = false;
		} else {
			$('#passwordMatchError').html('');
		}

		if (Role == ("STUDENT")) {
			$('#idError').html('');		// Clear existing error
			$('input[name="studID"]').parent().removeClass('has-error');
			if (StudentID == "") {
				var alert = generateAlertNonDismiss("Student ID cannot be empty", '', 4);
				$('#idError').html(alert);
				$('input[name="studID"]').parent().addClass('has-error');
				valid = false;
			} else if(valid) {
				var data = new Object();
				data.email = Email;
				data.password = Pass;
				data.role = Role;
				data.studentId = StudentID;
				data.fname = FName;
				data.lname = LName;
				data.code = "";
				
				// Turn on spinner
				$(this).addClass('active');
				$('#registrationSpinner').show();
				
				$.ajax({
					  method: "POST",
					  url: url,
					  contentType: "application/json",
					  data: JSON.stringify(data),
					  success: registrationCallback,
					  error: registrationErrorCallback
					});
			}
		}
		else if (Role == ("INSTRUCTOR")) {
			$('#accessError').html('');	// Clear existing error
			$('input[name="accessCode"]').parent().removeClass('has-error');
			if (AccessCode == "") {
				var alert = generateAlertNonDismiss("You must enter an access code to register as an instructor", '', 4);
				$('#accessError').html(alert);
				$('input[name="accessCode"]').parent().addClass('has-error');
				valid = false;
			} else if(valid){
				var data = new Object();
				data.email = Email;
				data.password = Pass;
				data.role = Role;
				data.studentId = "";
				data.fname = FName;
				data.lname = LName;
				data.code = AccessCode;

				// Turn on spinner
				$(this).addClass('active');
				
				$('#registrationSpinner').show();
				
				$.ajax({
					  method: "POST",
					  url: url,
					  contentType: "application/json",
					  data: JSON.stringify(data),
					  success: registrationCallback,
					  error: registrationErrorCallback
					});
			}


		}
		if(!valid){
			var alert = generateAlertNonDismiss("There are errors on the form, see above.", '', 4);
			$('#registrationError').html(alert);
			$('#registrationSpinner').addClass('hidden');
			$('#registerBtn').removeClass('disabled');
		} else {
			$('#registrationError').html('');
		}
	});

	// When click "Cancel"
	$(document).on('click', '#cancelButton', function(event) {
		sessionStorage.setItem("currPage", "login");
		loadPage("login");
	});

	//When user clicks on
	$(document).on('change', 'input[name="role"]', function(event) {
		if ($(this).val() == "INSTRUCTOR") {
			// Show access code
			$('.access-code').show();
			
			// Hide studentID from instructors
			$('input[name="studID"]').closest('.form-group').hide();
		}
		else {
			$('.access-code').hide();
			$('input[name="studID"]').closest('.form-group').show();
		}
	});
});

/**
 * Called when a response from the server comes back
 * about registering a user.
 * @param result Data from server
 * @param status If "success", no error
 */
function registrationCallback(result, status) {
	$('#registrationSpinner').addClass('hidden');
	$('#registerBtn').removeClass('disabled');
	
	if (status == 'success') {
		console.log("Sucessfully registered! Redirecting to login page...");
		$('#registerBtn').removeClass('active');
		sessionStorage.setItem("currPage", "login");
		loadPageParams("login", "registered=verifying&userId=" + result.userId + "&email=" + result.email);
		//loadPage("login");
	}
};
/**
 * Called when an error occurs about registering a user.
 * @param result
 * @param status
 */
function registrationErrorCallback(result, status) {
	$('#registrationSpinner').addClass('hidden');
	$('#registerBtn').removeClass('disabled');
	
	$('#registerBtn').removeClass('active');
	var alert = generateAlert(result.responseJSON.msg, 4);
	$('#registrationError').html(alert);
}