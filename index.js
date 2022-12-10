// Loads the configuration from config.env to process.env
require('dotenv').config({ path: 'config.env' });
const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors')
const bodyParser = require("body-parser");

var app = express();
app.use(express.json());

mongoose.set('strictQuery', true);

// Routes
app.use(require('./server/routes/daycare'));
app.use(require('./server/routes/appointment'));

// get MongoDB driver connection
const db = require('./server/db/conn');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  req.header("Allow-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET, OPTIONS");
  if (req.method === 'OPTIONS') {
    res.send(200).json({});
  } else {
    next();
  }
});

// perform a database connection when the server starts
db.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});


// Connect to MongoDB with the mongoose.connect()
const start = async () => {
  try {
    await mongoose.connect(
      process.env.ATLAS_URI
    );
   } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

exports.handler = async (event,context) => {
  const response = {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
      },
  };
  return response;
};