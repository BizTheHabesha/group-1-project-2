const router = require("express").Router();

// Get call for team info
router.get("/", async (req, res) => {
  console.log(req.body);
  const teamSearchUrl =
    "https://v3.football.api-sports.io/teams?search=" + req.query.term;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": process.env.APIKEY,
    },
  };

  try {
    const teamResponse = await fetch(teamSearchUrl, options);
    const teamData = await teamResponse.json();

    // Check if the team search response contains data
    if (teamData.response && teamData.response.length > 0) {
      const teamId = teamData.response[0].team.id;

      const squadUrl = `https://v3.football.api-sports.io/players/squads?team=${teamId}`;
      const squadResponse = await fetch(squadUrl, options);
      const squadData = await squadResponse.json();

      // Combine both team and squad data into a single object
      const responseData = {
        team: teamData,
        squad: squadData,
      };

      res.json(responseData);
      console.log(responseData);
    } else {
      res.json({ error: "No results found" });
    }
  } catch (e) {
    console.error({
      message: "error",
      error: e,
    });
    res.status(500).json(e.message);
  }
});

router.post("/", async (req, res) => {});

module.exports = router;
