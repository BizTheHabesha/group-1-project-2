const column1 = $("#column1");
const column2 = $("#column2");

let teamSearchUrl = "https://v1.basketball.api-sports.io/teams?search=";
let sport = "";

function addFavoriteAndViewListeners() {
	$("");
}

function doAlert(message, _severity) {
	let severity;
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
			severity = "alert-success";
			console.log(`${severity}: ${message}`);
			break;
		case "info":
			severity = "alert-primary";
			console.info(`${severity}: ${message}`);
			break;
		default:
			console.log(`Unknown Severity: ${message}`);
			severity = "alert-dark";
			break;
	}
	$(".alert-popup-container").prepend(
		`<div class="alert ${severity} alert-dismissible fade show" role="alert"> 
			${message} 
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>`
	);
}

$("#searchButton").click(async function (e) {
	e.preventDefault();

	const loadingMessage1 = [
		"Construction",
		"Deliberating",
		"Obfuscating",
		"Checking",
		"Managing",
		"Clearing",
		"Creating",
		"Forwarding",
		"Serating",
		"De-tensing",
		"Parsing",
		"Listening to",
		"Listening for",
		"Concatenating",
		"Digesting",
	];
	const loadingMessage2 = [
		"digest",
		"information",
		"data",
		"meat",
		"info",
		"stuff",
		"boring things",
		"load bearing structures",
		"listeners",
		"missing info",
		"chicken sandwiches",
		"aforemenioned discussions",
	];
	let message = `${
		loadingMessage1[Math.floor(Math.random() * loadingMessage1.length)]
	} the ${
		loadingMessage2[Math.floor(Math.random() * loadingMessage2.length)]
	}.`;

	$("p.load-message").text(message);
	$("div.spanner").toggleClass("show", true);
	$("div.overlay").toggleClass("show", true);

	const selected = $("#dropdownSportSelection").data("selected");
	if (!selected) {
		doAlert("Select a sport via the dropdown before searching", "warn");
		$("div.spanner").toggleClass("show", false);
		$("div.overlay").toggleClass("show", false);
		return;
	}

	const searchInput = $("#searchInput").val();
	const response = await fetch(`/api/search/football/?term=${searchInput}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok) {
		console.error("API request failed:", response.message);
		doAlert(`${response.status}: API Request failed`);
		$("div.spanner").removeClass("show");
		$("div.overlay").removeClass("show");
		return;
	}

	const resjson = await response.json();

	$("#searchResults").empty();

	const pages = Math.ceil(resjson.response.length / 10);

	if (!resjson.response.length) {
		console.error("No results found:", response.statusText);

		$("#searchResults").append(`
		<tr>
			<td colspan="5" class="text-center">No results found</td>
		</tr>`);

		$("div.spanner").removeClass("show");
		$("div.overlay").removeClass("show");
		return;
	}

	resjson.response.forEach((entry) => {
		$("#searchResults").append(`
		<tr data-id="${entry.team.id}">
			<td colspan="1"><img
					src="${entry.team.logo}"
					alt="${entry.team.name}'s Logo"
				/></td>
			<td colspan="1">${entry.team.name}</td>
			<td colspan="1">${entry.team.code}</td>
			<td colspan="1">${entry.team.country}</td>
			<td colspan="1"><button
					class="btn btn-outline-secondary pr-2"
					type="button"
					id="viewButton"
					data-id="${entry.team.id}"
				>View
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-eye"
						viewBox="0 0 16 16"
					>
						<path
							d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
						/>
						<path
							d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
						/>
					</svg></button>
				<button
					class="btn btn-outline-success"
					type="button"
					id="saveButton"
					data-id="${entry.team.id}"
				>Save
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-save"
						viewBox="0 0 16 16"
					>
						<path
							d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"
						/>
					</svg></button></td>
		</tr>
	`);
	});

	$("div.spanner").removeClass("show");
	$("div.overlay").removeClass("show");
});

$(".sport-select").on("click", function (e) {
	e.preventDefault();
	const selection = $(e.target).data("sport");

	$("#sportSelectionIcon").hide();

	$("#dropdownSportSelection")
		.text(selection)
		.toggleClass("btn-outline-danger", false)
		.toggleClass("btn-outline-success", true)
		.data("selected", "true");
});
