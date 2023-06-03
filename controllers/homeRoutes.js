const router = require("express").Router();
const { User } = require("../models");
const { ClogHttp } = require("../utils/clog");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
	const clog = new ClogHttp("GET /", true);
	try {
		clog.critical("!");
		res.render("homepage", {
			logged_in: !!req.session.logged_in,
		});
	} catch (err) {
		res.render("homepage", {
			logged_in: !!req.session.logged_in,
			error: err.message,
			status: 500,
		});
	}
});

router.get("/login", async (req, res) => {
	const clog = new ClogHttp("GET /login", true);
	try {
		clog.httpStatus(200);
		res.render("login", {
			logged_in: !!req.session.logged_in,
			render_as_body: true,
			custom_css: ["login"],
		});
		clog.info("rendered");
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.render("login", {
			logged_in: !!req.session.logged_in,
			render_as_body: true,
			custom_css: ["login"],
			error: err.message,
			status: 500,
		});
	}
});

router.get("/search", async (req, res) => {
	const clog = new ClogHttp("GET /search");
	try {
		res.render("search", {
			logged_in: !!req.session.logged_in,
		});
		clog.httpStatus(200);
		clog.info("rendered");
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.render("search", {
			logged_in: !!req.session.logged_in,
			status: 500,
			error: err.message,
		});
	}
});

module.exports = router;
