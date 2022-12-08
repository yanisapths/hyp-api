const express = require("express");
const uuid = require('uuid');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const appointmentRoutes = express.Router();

// This will help us connect to the database
const db = require('../db/conn');


// Read
// This section will help you get a list of all the documents.
appointmentRoutes.route("/appointment").get(async function (req, res) {
    const dbConnect = db.getDb();
  
    dbConnect
      .collection("appointmentDetails")
      .find({}).limit(50)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching appointment!");
       } else {
          res.json(result);
        }
      });
  });

  // This section will help you create a new document.
  appointmentRoutes.route("/appointment/create").post(function (req, res) {
    const dbConnect = db.getDb();
    const daycareDocument = {
      appointment_id: uuid.v1(),
      customerName: req.body.customerName,
      date: new Date(),
      phoneNumber: req.body.phoneNumber,
      startTime:req.body.startTime,
      endTime:req.body.endTime,
      daycare_name:req.body.daycare_name,
      status:req.body.status,
    };
  
    dbConnect
      .collection("appointmentDetails")
      .insertOne(daycareDocument, function (err, result) {
        if (err) {
          res.status(400).send("Error inserting appointment!");
        } else {
          console.log(`Added a new appointment with id ${result.insertedId}`);
          res.status(204).send();
        }
      });
  });

  // This section will help you update a document by id.
  appointmentRoutes.route("/appointment/update").post(function (req, res) {
  const dbConnect = db.getDb();
  const daycareQuery = { _id: req.body.id };
  const updates = {
    $inc: {
      likes: 1
    }
  };

  dbConnect
    .collection("appointmentDetails")
    .updateOne(daycareQuery, updates, function (err, _result) {
      if (err) {
        res.status(400).send(`Error updating likes on appointment with id ${daycareQuery.id}!`);
      } else {
        console.log("1 document updated");
      }
    });
});

// This section will help you delete a record.
appointmentRoutes.route("/appointment/delete/:id").delete((req, res) => {
  const dbConnect = db.getDb();
  const daycareQuery = { daycare_id: req.body.id };

  dbConnect
    .collection("appointmentDetails")
    .deleteOne(daycareQuery, function (err, _result) {
      if (err) {
        res.status(400).send(`Error deleting appointment with id ${daycareQuery.daycare_id}!`);
      } else {
        console.log("1 document deleted");
      }
    });
});

module.exports = appointmentRoutes;