const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const session = require("express-session");
const dotenv = require('dotenv').config()

// create express app
const bookingApi = express();

// parse requests of content-type - application/json
bookingApi.use(bodyParser.urlencoded({ extended: true }));
bookingApi.use(bodyParser.json());

// for session
const secKey = process.env.SEC_KEY;
bookingApi.use(
  session({ secret: secKey, saveUninitialized: true, resave: true })
);

//enable all cors request
bookingApi.use(cors());

// Configuring the database
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// Connecting to the database
const mongoUrl = process.env.MONGO_URL;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// require Routes
require("./apps/user/user.routes.js")(bookingApi);
require("./apps/booking/booking.routes.js")(bookingApi);

const port = process.env.PORT;
bookingApi.listen(port, () => {
  console.log(`Server is listening on port ${port} `);
});
