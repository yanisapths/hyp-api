const express = require("express");
const Daycare = require("../models/daycareModel");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;

// daycareRoutes is an instance of the express router.
const daycareRoutes = express.Router();

// This will help us connect to the database
const db = require("../db/conn");

// Get daycare's appointment
daycareRoutes.route("/daycare/:daycare_id/:appointment").get(async function (req, res) {
  const appointment = toId(req.params.appointment);
  const daycare = await Daycare.findById(req.params.daycare_id);
  daycare.appointmentList = appointment;
  res.json(daycare); 
 });

 // Get daycare's review
daycareRoutes.route("/daycare/:daycare_id/review/:review").get(async function (req, res) {
  const review = toId(req.params.review);
  const daycare = await Daycare.findById(req.params.daycare_id);
  daycare.reviews = review;
  res.json(daycare); 
 });

// Read
// This section will help you get a list of all the documents.
daycareRoutes.route("/daycare").get(async function (req, res) {
  const dbConnect = db.getDb();
  dbConnect
    .collection("daycareDetails")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching daycares!");
      } else {
        res.json(result);
      }
    });
});

// Get Daycare by id
daycareRoutes.route("/daycare/:daycare_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    const daycare = await dbConnect
      .collection("daycareDetails")
      .findOne({ daycare_id: req.params.daycare_id });
    res.send(daycare);
  } catch {
    res.status(404);
    res.send({ error: "Daycare doesn't exist!" });
  }
});

// This section will help you create a new document.
daycareRoutes.route("/daycare/create").post(async (req, res) => {
  const dbConnect = db.getDb();
  const create = await Daycare.create(req.body);
  dbConnect.collection("daycareDetails").insertOne(create, (err, result) => {
    if (err) {
      res.status(400).send("Error inserting daycare!");
    } else {
      return res.status(201).json(create);
    }
  });
});

// This section will help you update a document by id.
daycareRoutes.route("/daycare/update/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const updates = {
    $set: {
      daycare_name: req.body.daycare_name,
      address: req.body.address,
      location: req.body.location,
      owner: req.body.owner,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      price: req.body.price,
      approvalStatus: req.body.approvalStatus,
      appointmentList: req.body.appointmentList,
      reviews: req.body.reviews,
    },
  };
  await dbConnect
    .collection("daycareDetails")
    .updateOne({ daycare_id: req.params.id }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating on daycare!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// This section will help you delete a daycare.
daycareRoutes.route("/daycare/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    await dbConnect
      .collection("daycareDetails")
      .deleteOne({ daycare_id: req.params.id });
    res.status(200).send("daycare has been deleted!");
  } catch {
    res.status(404).send({ error: "Daycare doesn't exist!" });
  }
});

module.exports = daycareRoutes;
