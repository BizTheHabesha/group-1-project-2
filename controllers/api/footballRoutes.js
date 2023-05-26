const router = require("express").Router();
const { User } = require("../../models");
const { ClogHttp } = require("../../utils/clog");

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
