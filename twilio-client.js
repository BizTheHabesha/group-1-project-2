const Account_SID = process.env.TWILIO_SID;
const API_KEY = process.env.TWILIP_API_KEY;

const client = require("twilio")(Account_SID, API_KEY);

module.exports = { client };
