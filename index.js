// Loads the configuration from config.env to process.env
require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const awsServerlessExpress = require("aws-serverless-express");

var app = express();
app.use(cors());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
mongoose.set("strictQuery", true);

// Routes
app.use(require("./server/routes/clinic"));
app.use(require("./server/routes/appointment"));
app.use(require("./server/routes/review"));
app.use(require("./server/routes/staff"));
app.use(require("./server/routes/course"));
app.use(require("./server/routes/available"));
app.use(require("./server/routes/patient"));
app.use(require("./server/routes/event"));

// get MongoDB driver connection
const db = require("./server/db/conn");
const PORT = process.env.PORT || 5000;

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === "OPTIONS") {
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

module.exports = app;