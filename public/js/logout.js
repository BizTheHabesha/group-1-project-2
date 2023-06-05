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

$(".logout-btn").click(async function (e) {
	e.preventDefault();
	const response = await fetch("/api/users/logout", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});

	if (response.ok) {
		document.location.replace("/login");
	} else {
		doAlert(response.statusText, "error");
	}
});
