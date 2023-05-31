const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    res.render("search");
  } catch (e) {
    console.error({
      message: "error",
      error: e,
    });
    res.status(500).json(e.message);
  }
});

router.post("/", async (req, res) => {
  const url = "https://v3.football.api-sports.io/teams?id=" + "1595";
  var options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": process.env.APIKEY,
    },
  };

  try {
    const fetch = await import("node-fetch");
    const response = await fetch.default(url, options);
    const data = await response.json();
    res.render("search", { data });
    console.log(data);
  } catch (e) {
    console.error({
      message: "error",
      error: e,
    });
    res.status(500).json(e.message);
  }
});

module.exports = router;
