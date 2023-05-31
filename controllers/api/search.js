const router = require("express").Router();

router.get("/", async (req, res) => {
  console.log(req.body);
  const url =
    "https://v3.football.api-sports.io/teams?search=" + req.query.term;
  var options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": process.env.APIKEY,
    },
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data.response);
    console.log(data);
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
