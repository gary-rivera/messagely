"use strict";

/** Common config for message.ly */

// read .env files and make environmental variables

require("dotenv").config();

const DB_URI = (process.env.NODE_ENV === "test")
    ? "postgresql:///messagely_test"
    : "postgresql:///messagely";

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const BCRYPT_WORK_FACTOR = 12;

//twilio
const accountSid = process.env.TWILIO_ACCOUNT; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

module.exports = {
  client,
  twilioPhone,
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
};

