const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const { ClogHttp } = require("./utils/clog");
const { Model, DataTypes } = require("sequelize");
const User = require("../group-1-project-2/models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_API_KEY;
const client = require("twilio")(accountSid, authToken);

const app = express();
const PORT = process.env.PORT || 3001;
// move the api calls to the routes in controllers

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

app.use(routes);

// Function to retrieve the most recent phone number
const getMostRecentPhoneNumber = async () => {
  try {
    // Find the most recent user based on the creation date
    const user = await User.findOne({
      order: [["createdAt", "DESC"]],
    });

    // Extract the phone number from the user
    const phoneNumber = user ? user.phone : null;

    return phoneNumber;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const logInTwilio = async () => {
  try {
    // Retrieve the most recent phone number
    const phoneNumber = await getMostRecentPhoneNumber();
    console.log(phoneNumber);
    // Check if a phone number is available
    if (!phoneNumber) {
      console.log("No phone number found");
      return;
    }

    // Send Twilio message
    const message = await client.messages.create({
      body: "Hello, This is a courtesy notice that your SportsSensei account has been logged into to. If that was not you, please contact our customer support team.",
      from: "+18667064709",
      to: phoneNumber,
    });
    console.log(phoneNumber);
    console.log(message.sid);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

app.get("/trigger-login", async (req, res) => {
  try {
    await logInTwilio();
    console.log("hello");
    res.sendStatus(200); // Send a success status code
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Send an error status code
  }
});

app.get("*", (req, res) => {
  const clog = new ClogHttp("catchall", true);
  clog.httpStatus(404, `${JSON.stringify(req.route)}`);
  res.status(404).render("404");
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    const clog = new ClogHttp("Server Init", false);
    clog.success(`Now listening on port ${PORT}`);
  });
});
