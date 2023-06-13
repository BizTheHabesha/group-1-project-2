const { ClogHttp, Arbitrator } = require("../../utils/clog");

const router = require("express").Router();

// Get call for team info
router.post("/", async (req, res) => {
	const clog = new ClogHttp("/api/search/?term");
	const arb = new Arbitrator("/api/search/?term");

	res.status(410).json({ message: "Deprecated route." });
	clog.httpStatus(410, "Deprecated route.");
	try {
		throw new Error("Test error");
	} catch (error) {
		arb.trace(error, "f");
	}
	return;

	const teamSearchUrl = req.body.url + req.query.term;
	console.log(req.query.term);
	const sport = req.body.value;
	const sportVersions = {
		football: "v3",
		basketball: "v1",
		baseball: "v1",
		americanFootball: "v1",
		hockey: "v1",
	};
	const version =
		sport === "american-football"
			? sportVersions["americanFootball"]
			: sportVersions[sport];

	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-host": `v3.${sport}.api-sports.io`,
			"x-rapidapi-key": process.env.APIKEY,
		},
	};

	try {
		const teamResponse = await fetch(teamSearchUrl, options);
		const teamData = await teamResponse.json();
		let squadData = {};
		let teamStandingsData = {};
		let leagueStandingsData = {};

		// if searching the soccer API, search for the player squad information
		if (
			req.body.url === "https://v3.football.api-sports.io/teams?search="
		) {
			if (teamData.response && teamData.response.length > 0) {
				const teamId = teamData.response[0].team.id;
				const squadUrl = `https://v3.football.api-sports.io/players/squads?team=${teamId}`;
				const coachUrl = `https://v3.football.api-sports.io/coachs?team=${teamId}`;
				const teamStandingsUrl = `https://v3.football.api-sports.io/standings?season=2022&team=${teamId}`;
				const teamGamesUrl = `https://v3.football.api-sports.io/fixtures?season=2022&team=${teamId}`;

				const squadResponse = await fetch(squadUrl, options);
				const coachResponse = await fetch(coachUrl, options);
				const teamStandingsResponse = await fetch(
					teamStandingsUrl,
					options
				);
				const teamGamesResponse = await fetch(teamGamesUrl, options);

				if (!teamGamesResponse.ok) {
					res.status(421).json({
						message: "API-Football didn't return OK",
					});
					clog.httpStatus(421, "API-Football didn't return OK");
				}

				squadData = await squadResponse.json();
				coachData = await coachResponse.json();
				teamStandingsData = await teamStandingsResponse.json();
				teamGamesData = await teamGamesResponse.json();

				console.log(teamData.teamstandings);
				const leagueId = teamStandingsData.response[0].league.id;
				const leagueStandingsUrl = `https://v3.football.api-sports.io/standings?season=2022&league=${leagueId}`;
				// const teamStatisticsUrl = `https://v3.football.api-sports.io/teams/statistics?team=${teamId}&league=${leagueId}&season=2022`;

				const leagueStandingsResponse = await fetch(
					leagueStandingsUrl,
					options
				);
				// const teamStatisticsResponse = await fetch(teamStatisticsUrl, options);

				leagueStandingsData = await leagueStandingsResponse.json();
				// teamStatisticsData = await teamStatisticsResponse.json();

				const responseData = {
					team: teamData.response[0],
					squad: squadData,
					coach: coachData,
					teamGames: teamGamesData,
					// teamStatistics: teamStatisticsData,
					teamStandings: teamStandingsData,
					leagueStandings: leagueStandingsData,
				};

				res.json(responseData);
			} else {
				res.json({ error: "No results found" });
			}
		} else {
			// If not searching the soccer API, search for standing information
			if (teamData.response && teamData.response.length > 0) {
				const teamId = teamData.response[0].id;

				const standingsUrl = `https://v1.basketball.api-sports.io/statistics?season=2023&team=${teamId}&league=12&date=2021-05-12`;
				console.log(standingsUrl);
				const standingsResponse = await fetch(standingsUrl, options);
				const standingsData = await standingsResponse.json();

				const responseData = {
					team: teamData.response[0],
					squad: squadData,
					standings: structuredClone(standingsData),
				};

				res.json(responseData);
			} else {
				res.json({ error: "No results found" });
			}
		}
	} catch (error) {
		console.error("API request failed:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/football", async (req, res) => {
	const clog = new ClogHttp("GET /api/search/football/?term?id", true);
	const arb = new Arbitrator("GET /api/search/football/?term?id", true);
	const qterm = req.query.term;

	const apifootballURL = "https://v3.football.api-sports.io/teams";
	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-host": "v3.football.api-sports.io",
			"x-rapidapi-key": `${process.env.APIKEY}`,
		},
	};
	const clogExt = new ClogHttp(apifootballURL, true);

	try {
		if (!qterm) {
			clog.httpStatus(9406, "at least 1 query must be provided");
			res.status(406).json("at least 1 query must be provided");

			return;
		} else if (qterm) {
			const response = await fetch(
				`${apifootballURL}/?search=${qterm}`,
				options
			);

			const resjson = await response.json();
			switch (response.status) {
				case 200:
					clogExt.httpStatus(200, resjson);
					clog.httpStatus(200, "API-Football returned 200");
					res.status(200).json(resjson);
					break;

				case 204:
					clogExt.httpStatus(204, resjson);
					clog.httpStatus(204, "API-Football returned 204");
					res.status(200).json(resjson);
					break;

				case 499:
					clogExt.httpStatus(499, resjson);
					clog.httpStatus(
						499,
						"API closed reqeust before API-Football returned"
					);
					res.status(200).json(resjson);
					break;

				case 500:
					clogExt.httpStatus(500, resjson);
					clog.httpStatus(503, {
						message: "API-Football unavailable",
					});
					res.sendStatus(503);
					return;
					break;

				default:
					clogExt.httpStatus(response.status, resjson);
					clog.httpStatus(response.status, response.statusText);
					res.status(503).json({
						message: "API-Football returned an unexpected status.",
					});
					break;
			}

			return;
		}
		clog.httpStatus(
			406,
			"at least 1 query, parameter, or body attr is missing"
		);
		res.status(406).json({
			message: "at least 1 query, parameter, or body attr is missing",
		});
	} catch (error) {
		clog.httpStatus(500, error.message);
		arb.trace(error, "error");
		res.status(500).json({ message: error.message });
	}

	const response = fetch(`${url}${qterm}`);
	clog.httpStatus(501);
	res.sendStatus(501);
});

router.post("/americanfootball", async (req, res) => {
	const clog = new ClogHttp("POST /api/search/americanfootball", true);
	clog.httpStatus(501);
	res.sendStatus(501);
});

router.post("/hockey", async (req, res) => {
	const clog = new ClogHttp("POST /api/search/hockey", true);
	clog.httpStatus(501);
	res.sendStatus(501);
});

router.post("/baseball", async (req, res) => {
	const clog = new ClogHttp("POST /api/search/baseball", true);
	clog.httpStatus(501);
	res.sendStatus(501);
});

module.exports = router;
