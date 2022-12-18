// Loads the configuration from config.env to process.env
require("dotenv").config({ path: "config.env" });
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
const bodyParser = require("body-parser");
const awsServerlessExpress = require("aws-serverless-express");

var app = express();
app.use(express.json());

mongoose.set("strictQuery", true);

// Routes
app.use(require("./server/routes/clinic"));
app.use(require("./server/routes/appointment"));
app.use(require("./server/routes/review"));

// get MongoDB driver connection
const db = require("./server/db/conn");
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  req.header(
    "Allow-Control-Allow-Methods",
    "PUT, POST, PATCH, DELETE, GET, OPTIONS"
  );
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

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const server = awsServerlessExpress.createServer(app);
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
