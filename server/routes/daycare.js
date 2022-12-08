const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const daycareRoutes = express.Router();

// This will help us connect to the database
const db = require('../db/conn');


// Read
// This section will help you get a list of all the documents.
daycareRoutes.route("/daycare").get(async function (req, res) {
    const dbConnect = db.getDb();
  
    dbConnect
      .collection("daycareDetails")
      .find({}).limit(50)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching daycares!");
       } else {
          res.json(result);
        }
      });
  });

  // This section will help you create a new document.
  daycareRoutes.route("/daycare/create").post(function (req, res) {
    const dbConnect = db.getDb();
    const daycareDocument = {
      daycare_id: req.body.id,
      owner: req.body.owner,
      address: req.body.address,
      location: req.body.location,
      email:req.body.email,
      phoneNumber:req.body.phoneNumber,
      imageUrl:req.body.imageUrl,
      approvalStatus:req.body.approvalStatus,
      appointmentList:req.body.appointmentList
    };
  
    dbConnect
      .collection("daycareDetails")
      .insertOne(daycareDocument, function (err, result) {
        if (err) {
          res.status(400).send("Error inserting daycare!");
        } else {
          console.log(`Added a new daycare with id ${result.insertedId}`);
          res.status(204).send();
        }
      });
  });

  // This section will help you update a document by id.
  daycareRoutes.route("/daycare/update").post(function (req, res) {
  const dbConnect = db.getDb();
  const daycareQuery = { _id: req.body.id };
  const updates = {
    $inc: {
      likes: 1
    }
  };

  dbConnect
    .collection("daycareDetails")
    .updateOne(daycareQuery, updates, function (err, _result) {
      if (err) {
        res.status(400).send(`Error updating likes on daycare with id ${daycareQuery.id}!`);
      } else {
        console.log("1 document updated");
      }
    });
});

// This section will help you delete a record.
daycareRoutes.route("/daycare/delete/:id").delete((req, res) => {
  const dbConnect = db.getDb();
  const daycareQuery = { daycare_id: req.body.id };

  dbConnect
    .collection("daycareDetails")
    .deleteOne(daycareQuery, function (err, _result) {
      if (err) {
        res.status(400).send(`Error deleting daycare with id ${daycareQuery.daycare_id}!`);
      } else {
        console.log("1 document deleted");
      }
    });
});

module.exports = daycareRoutes;