const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");
require("dotenv").config();
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_API_KEY;
const client = require("twilio")(accountSid, authToken);
const { ClogHttp } = require("./utils/clog");

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;
// move the api calls to the routes in controllers

// Twilio Create Message
// client.messages
//   .create({
//     body: "Hello, welcome to Score Sensei!",
// from: number is the designated twillio tol-free phone number. * We have a limited number of twilio calls before we run out of trial money.
//     from: "+18667064709",
// in the to: line, we put the phone number the text will be sent to.  We could create a variable that draws from the user's phone number.
//     to: "+xxxxxxxxxxx",
//   })
//   .then((message) => console.log(message.sid));

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
	secret: "Super secret secret",
	cookie: {
		maxAge: 300000,
		httpOnly: true,
		secure: false,
		sameSite: "strict",
	},
	resave: false,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize,
	}),
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(require("./controllers"));

app.get("*", (req, res) => {
	const clog = new ClogHttp("catchall", true);
	clog.httpStatus(404, `${JSON.stringify(req.route)}`);
	res.status(404).render("404");
});

app.listen(PORT, () => {
	sequelize.sync({ force: false });
	console.log("Now listening");
});
