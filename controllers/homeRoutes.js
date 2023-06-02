const router = require("express").Router();
const { User } = require("../models");
const { ClogHttp } = require("../utils/clog");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
	const clog = new ClogHttp("GET /", true);
	try {
		clog.critical("!");
		res.render("homepage");
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/login", async (req, res) => {
	const clog = new ClogHttp("GET /login", true);
	try {
		clog.httpStatus(200);
		res.render("login", {
			render_as_body: true,
			custom_css: ["login"],
		});
		clog.info("rendered");
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json(err);
	}
});

router.get("/search", async (req, res) => {
	res.render("search");
});

module.exports = router;
