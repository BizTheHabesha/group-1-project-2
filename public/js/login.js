const loginBtn = $("#loginBtn");
const signUpBtn = $("#signUpBtn");

function doAlert(message, _severity) {
	let severity;
	switch (_severity) {
		case "error":
			severity = "alert-danger";
			break;
		case "warn":
			severity = "alert-warning";
			break;
		case "success":
			severity = "alert-success";
			break;
		case "info":
			severity = "alert-primary";
			break;
		default:
			severity = "alert-dark";
			break;
	}
	$(".display-popup").addClass(severity).show();
}

$("#signUpBtn").submit(async (e) => {
	e.preventDefault();

	const email = $("#register-email").val().trim();
	const password = $("#register-password").val().trim();
	const phoneNumber = $("#register-phone").val().trim();

	const signUp = await fetch("/api/users", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
			phone,
		}),
	});

	if (signUp.ok) {
		document.location.replace("/");
	} else {
		const errorData = await signUp.json();
	}
});

// Login Button

$("#loginBtn").submit(async (e) => {
	e.preventDefault();

	const email = $("#login-email").val().trim();
	const password = $("#login-password").val().trim();

	const logIn = await fetch("/api/users/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: username,
			password,
		}),
	});

	if (logIn.ok) {
		document.location.replace("/");
	} else {
		doAlert(JSON.stringify(logIn.json()), "error");
	}
});
