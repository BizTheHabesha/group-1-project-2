const router = require("express").Router();
const { User } = require("../../models");
const { ClogHttp } = require("../../utils/clog");
const fetch = require("node-fetch");
var request = require("request");

//examples

// get a player by id
router.get("/players/:player_id", async (req, res) => {
  const clog = new ClogHttp("/players/:player_id");
  try {
    // do stuff
  } catch (err) {
    clog.statusMessage(500, err.message);
    res.status(500).json(err);
  }
});

router.get("/players/search", async (req, res) => {
  const url = "https://v3.football.api-sports.io/players";
  var options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": "9bc65e77a74fe61fdbe484513209802e",
    },
  };
  const response = await fetch(url, options)
    .then((res) => res.json())
    .then((data) => console.log(data))

    .catch((e) => {
      console.error({
        message: "error",
        error: e,
      });
    });
});
