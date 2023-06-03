const router = require("express").Router();

// Get call for team info
router.post("/", async (req, res) => {
  console.log(req.query);
  // console.log(req.body);
  const teamSearchUrl = req.body.url + req.query.term;
  const sport = req.body.sport;
  const sportVersions = {
    football: "v3",
    basketball: "v1",
    baseball: "v1",
    americanFootball: "v1",
    hockey: "v1",
  };
  if (sport == "american-football") {
    const version = sportVersions["americanFootball"];
  } else {
    const version = sportVersions[sport];
  }

  console.log(teamSearchUrl);

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": `v3.${sport}.api-sports.io`,
      "x-rapidapi-key": process.env.APIKEY,
    },
  };

  try {
    await fetch(teamSearchUrl, options)
      .then((response) => {
        return response.json();
      })
      // trying to chain together another fetch call

      .then((data) => {
        let originalData = data;
        console.log(data);
        res.json(data);
        const teamId = data.response[0].team.id;
        return fetch(
          `https://v3.football.api-sports.io/players/squads?team=${teamId}`
        );
      })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      })
      .then(function (userData) {})
      .catch(function (error) {
        console.warn(error);
      });
  } catch (e) {
    console.error({
      message: "error",
      error: e,
    });
    // res.status(500).json(e.message);
  }
});

// router.post("/", async (req, res) => {});

module.exports = router;
