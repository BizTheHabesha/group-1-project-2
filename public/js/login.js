const loginBtn = $("#loginBtn");
const signUpBtn = $("#signUpBtn");

function doAlert(message, _severity) {
	let severity;
	$(".alert-popup").removeClass(
		"alert-danger alert-warning alert-success alert-primary alert-dark"
	);
	switch (_severity) {
		case "error":
			console.error(`${severity}: ${message}`);
			severity = "alert-danger";
			break;
		case "warn":
			severity = "alert-warning";
			console.warn(`${severity}: ${message}`);
			break;
		case "success":
			console.log(`${severity}: ${message}`);
			severity = "alert-success";
			break;
		case "info":
			console.info(`${severity}: ${message}`);
			severity = "alert-primary";
			break;
		default:
			console.log(`${severity}: ${message}`);
			severity = "alert-dark";
			break;
	}

	$(".alert-popup").addClass(severity).text(message).show();
}

$("#signUpBtn").click(async function (e) {
	e.preventDefault();
	const email = $("#register-email").val().trim();
	const password = $("#register-password").val().trim();
	const phone = $("#register-phone").val().trim();

	console.log(`PHONE: ${phone} | EMAIL: ${email} | PASSWORD: ${password}`);

	if (phone && email && password) {
		const response = await fetch("/api/users/", {
			method: "POST",
			body: JSON.stringify({ phone, email, password }),
			headers: { "Content-Type": "application/json" },
		});

		if (response.ok) {
			document.location.replace("/");
		} else {
			doAlert(response.statusText, "error");
		}
	} else {
		doAlert("Please enter a username, email, and password.", "warn");
	}
});

// Login Button

$("#loginBtn").click(async (e) => {
	e.preventDefault();

	// Collect values from the login form
	const email = $("#login-email").val().trim();
	const password = $("#login-password").val().trim();

	if (!email || !password) {
		doAlert("Please enter your email and password.", "warn");
		return;
	}
	// Send a POST request to the API endpoint
	const response = await fetch("/api/users/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
		headers: { "Content-Type": "application/json" },
	});

	if (response.ok) {
		// If successful, redirect the browser to the profile page
		document.location.replace("/");
	} else {
		doAlert(response.statusText, "error");
	}
});
