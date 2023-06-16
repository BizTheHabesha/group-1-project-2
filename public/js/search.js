$(".results-container").hide();
// $("#pagination").hide();

let routeSpec = "";
let maxEntries = 10;
let pages = 1;
let page = 1;
const range = [0, maxEntries - 1];

function pagination(_pages = 0) {
	const pages = _pages > 1 ? _pages : 1;
	$("#pagination").append("");
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

function addFavoriteAndViewListeners() {
	$(".save-button").click(async function (e) {
		e.preventDefault();
		const teamId = $(e.target).data("id");
		const response = await fetch("/api/users/favorite", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: {},
		});
	});
	$(".view-button").click(function (e) {
		e.preventDefault();
		const teamId = $(e.target).data("id");
	});
}

/**
 *
 * @param {Object[]} arr
 */
function drawEntries(arr) {
	arr.forEach((entry) => {
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
					class="btn btn-outline-warning save-button"
					type="button"
					data-id="${entry.team.id}"
				>Save
					<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-star"
					viewBox="0 0 16 16"
				>
					<path
						d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
					/>
				</svg>
				<div class="spinner-border spinner-border-sm" role="status">
					<span class="visually-hidden">Loading...</span>
				</div></button></td>
		</tr>
	`);
	});
	addFavoriteAndViewListeners();
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
	const response = await fetch(
		`/api/search/${routeSpec}/?term=${searchInput}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (!response.ok) {
		console.error("API request failed:", response.message);
		doAlert(`${response.status}: API Request failed`);
		$("div.spanner").removeClass("show");
		$("div.overlay").removeClass("show");
		return;
	}

	const resjson = await response.json();
	const serRes = resjson.response;

	pages = Math.ceil(serRes.length / maxEntries);

	$("#searchResults").empty();
	$(".results-container").show();

	if (!serRes.length) {
		console.error("No results found:", response.statusText);

		$("#searchResults").append(`
		<tr>
			<td colspan="5" class="text-center">No results found</td>
		</tr>`);

		$("div.spanner").removeClass("show");
		$("div.overlay").removeClass("show");
		return;
	}

	drawEntries(serRes);

	$("div.spanner").removeClass("show");
	$("div.overlay").removeClass("show");
});

$(".sport-select").on("click", function (e) {
	e.preventDefault();
	const selection = $(e.target).data("sport");
	routeSpec = $(e.target).data("apiroute");
	$("#sportSelectionIcon").hide();

	$("#dropdownSportSelection")
		.text(selection)
		.toggleClass("btn-outline-danger", false)
		.toggleClass("btn-outline-success", true)
		.data("selected", "true");
});
