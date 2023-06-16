const router = require("express").Router();
const { User } = require("../../models");
const { ClogHttp } = require("../../utils/clog");

// creating new user and POST

router.get("/", async (req, res) => {
	const clog = new ClogHttp("GET /api/users/", true);
	try {
		const findRes = await User.findAll();
		if (findRes) {
			clog.httpStatus(200);
			res.status(200).json(findRes);
			return;
		}
		clog.httpStatus(404, "No users in database");
		res.status(404);
	} catch (err) {
		clog.httpStatus(500, err.message);
		console.log(err);
		res.status(500).json({ message: clog.statusMessage(500) });
	}
});

router.post("/", async (req, res) => {
	const clog = new ClogHttp("POST /api/users/", true);
	try {
		const createRes = await User.create(req.body);
		if (createRes) {
			clog.info(JSON.stringify(createRes));
			req.session.save(() => {
				req.session.user_id = createRes.id;
				req.session.logged_in = true;
				// req.session.cookie.expires = false;
				clog.httpStatus(200, "user created");
				res.status(200).json(createRes);
				return;
			});
		} else {
			clog.critical(`falsy createRes ${JSON.stringify(createRes)}`);
			clog.httpStatus(503, "sequelize service unavailable");
			res.status(503).json({ message: "sequelize service unavailable" });
		}
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json(err);
	}
});

// Login

router.post("/login", async (req, res) => {
	const clog = new ClogHttp("POST /api/users/login", true);
	try {
		const userData = await User.findOne({
			where: { email: req.body.email },
		});

		if (!userData) {
			clog.httpStatus(400, "Email does not have an account");
			res.status(400).json({
				message: "This email does not have an account.",
			});
			return;
		}

		const validPassword = await userData.C_PW_UH(req.body.password);

		if (!validPassword) {
			clog.httpStatus(400, "Incorrect email or password");
			res.status(400).json({
				message: "Incorrect email or password, please try again.",
			});
			return;
		}

		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.logged_in = true;
			req.session.cookie.expires = false;
			clog.httpStatus(
				200,
				`User ${req.session.user_id} is now logged in...`
			);
			res.status(200).json({
				user: userData,
				message: "You are now logged in!",
			});
		});
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json(err);
	}
});

router.post("/logout", async (req, res) => {
	const clog = new ClogHttp("POST /api/users/logout", true);
	try {
		req.session.destroy((err) => {
			if (err) {
				clog.critical("Session destruction failed:");
				clog.error(JSON.stringify(err));
			}
		});
		res.sendStatus(200);
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.send(500).json(err);
	}
});

router.put("/favorite", async (req, res) => {
	const clog = new ClogHttp("/api/users/favorite", true);
	try {
		clog.httpStatus(503, "PUT for /favorite is not implemented");
		res.sendStatus(503);
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.sendStatus(500);
	}
});

router.post("/favorite", async (req, res) => {
	console.log("hey");
	try {
		const newFavorite = req.body.favorite;
		await User.update(
			{ ...req.body },
			{ where: { id: req.session.user_id } }
		);
		// modify the response.status on line 114 to return the search query
		// and the id that the database saves the search query with
		// the front end will
		console.log(req.body);
		res.status(200).json({ message: "Content saved successfully" });
	} catch (error) {
		console.error("Error saving content:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/favorite", async (req, res) => {
	const clog = new ClogHttp("GET /api/users/favorite", true);
	clog.httpStatus(501);
	res.status(501).json({
		message: "GET for '/favorite' endpoint not implemented",
	});
});

router.get("/favorite/:user_id", async (req, res) => {
	const clog = new ClogHttp(
		`GET /api/users/favorite/${req.params.user_id}`,
		true
	);
	clog.httpStatus(501);
	res.status(501).json({
		message: `GET for '/favorite/:user_id' endpoint not implemented`,
	});
});

module.exports = router;
