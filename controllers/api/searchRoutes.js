const router = require("express").Router();

// Get call for team info
router.post("/", async (req, res) => {
  const teamSearchUrl = req.body.url + req.query.term;
  console.log(req.body.term);
  const sport = req.body.sport;
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
    if (req.body.url === "https://v3.football.api-sports.io/teams?search=") {
      if (teamData.response && teamData.response.length > 0) {
        const teamId = teamData.response[0].team.id;
        const squadUrl = `https://v3.football.api-sports.io/players/squads?team=${teamId}`;
        const coachUrl = `https://v3.football.api-sports.io/coachs?team=${teamId}`;
        const teamStandingsUrl = `https://v3.football.api-sports.io/standings?season=2022&team=${teamId}`;
        const teamGamesUrl = `https://v3.football.api-sports.io/fixtures?season=2022&team=${teamId}`;

        const squadResponse = await fetch(squadUrl, options);
        const coachResponse = await fetch(coachUrl, options);
        const teamStandingsResponse = await fetch(teamStandingsUrl, options);
        const teamGamesResponse = await fetch(teamGamesUrl, options);

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

module.exports = router;
