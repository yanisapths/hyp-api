// Loads the configuration from config.env to process.env
require('dotenv').config({ path: 'config.env' });
const express = require("express");
var cors = require('cors')
const bodyParser = require("body-parser");
var app = express();
app.use(require('./server/routes/daycare'));

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

// // Read
// // This section will help you get a list of all the documents.
// app.get("/daycare",async function (req, res) {
//     const dbConnect = db.getDb();
  
//     dbConnect
//       .collection("daycareDetails")
//       .find({}).limit(50)
//       .toArray(function (err, result) {
//         if (err) {
//           res.status(400).send("Error fetching daycares!");
//        } else {
//           res.json(result);
//         }
//       });
//   });

//   // This section will help you create a new document.
//   app.post("/daycare/create",function (req, res) {
//     const dbConnect = db.getDb();
//     const daycareDocument = {
//       daycare_id: req.body.id,
//       last_modified: new Date(),
//       owner: req.body.owner,
//       address: req.body.address,
//       location: req.body.location,
//       email:req.body.email,
//       phoneNumber:req.body.phoneNumber,
//       imageUrl:req.body.imageUrl,
//       approvalStatus:req.body.approvalStatus,
//       appointmentList:req.body.appointmentList
//     };
  
//     dbConnect
//       .collection("daycareDetails")
//       .insertOne(daycareDocument, function (err, result) {
//         if (err) {
//           res.status(400).send("Error inserting daycare!");
//         } else {
//           console.log(`Added a new daycare with id ${result.insertedId}`);
//           res.status(204).send();
//         }
//       });
//   });

//   // This section will help you update a document by id.
//   app.post("/daycare/update",function (req, res) {
//   const dbConnect = db.getDb();
//   const daycareQuery = { _id: req.body.id };
//   const updates = {
//     $inc: {
//       likes: 1
//     }
//   };

//   dbConnect
//     .collection("daycareDetails")
//     .updateOne(daycareQuery, updates, function (err, _result) {
//       if (err) {
//         res.status(400).send(`Error updating likes on daycare with id ${daycareQuery.id}!`);
//       } else {
//         console.log("1 document updated");
//       }
//     });
// });

// // This section will help you delete a record.
// app.delete("/daycare/delete/:id",(req, res) => {
//   const dbConnect = db.getDb();
//   const daycareQuery = { daycare_id: req.body.id };

//   dbConnect
//     .collection("daycareDetails")
//     .deleteOne(daycareQuery, function (err, _result) {
//       if (err) {
//         res.status(400).send(`Error deleting daycare with id ${daycareQuery.daycare_id}!`);
//       } else {
//         console.log("1 document deleted");
//       }
//     });
// });
