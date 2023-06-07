const router = require("express").Router();
const { User } = require("../models");
const { ClogHttp } = require("../utils/clog");
const withAuth = require("../utils/auth");
const withoutAuth = require("../utils/woauth");

router.get("/", withAuth, async (req, res) => {
	const clog = new ClogHttp("GET /", true);
	try {
		const userData = await User.findByPk(req.session.user_id);
		const user = userData.get({ plain: true });
		clog.info(`Got user ${user.id}`);
		const favoriteTeam = user.favoriteTeam;
		clog.info(
			`Found favorites: ${favoriteTeam ? favoriteTeam : "No favorites"}`
		);

		// Render with error if there are no favorites
		if (!favoriteTeam) {
			clog.httpStatus(200, "No favorites");
			res.render("homepage", {
				logged_in: !!req.session.logged_in,
				info: "Search for a team to add it as a favorite!",
			});
			clog.info("rendered");
			return;
		}
		const teamSearchUrl =
			"https://v3.football.api-sports.io/teams?search=" + favoriteTeam;

		const options = {
			method: "GET",
			headers: {
				"x-rapidapi-host": `v3.football.api-sports.io`,
				"x-rapidapi-key": process.env.APIKEY,
			},
		};

		const teamResponse = await fetch(teamSearchUrl, options);
		const teamData = await teamResponse.json();
		const serTeamData = teamData.response[0];

		clog.info(JSON.stringify(serTeamData));

		clog.httpStatus(200);
		res.render("homepage", {
			serTeamData,
			favorites: [favoriteTeam],
			logged_in: !!req.session.logged_in,
		});
		clog.info("rendered");
	} catch (err) {
		clog.httpStatus(500, err.message);
		clog.error(err.stack);
		res.render("homepage", {
			logged_in: !!req.session.logged_in,
			error: err.message,
			status: 500,
		});
	}
});

router.get("/login", withoutAuth, async (req, res) => {
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
		clog.critical(JSON.stringify(err));
	}
});
router.get("/search", withAuth, async (req, res) => {
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
