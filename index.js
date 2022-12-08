// Loads the configuration from config.env to process.env
require('dotenv').config({ path: 'config.env' });
const express = require("express");
var cors = require('cors')
const bodyParser = require("body-parser");
var app = express();
app.use(require('./server/routes/daycare'));
app.use(require('./server/routes/appointment'));

// get MongoDB driver connection
const db = require('./server/db/conn');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Global error handling
app.use(function (err, _req, res) {
  console.error(err.stack);
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