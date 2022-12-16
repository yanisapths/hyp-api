const express = require("express");
const { Clinic } = require("../models/clinicModel");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;

// clinicRoutes is an instance of the express router.
const clinicRoutes = express.Router();

// This will help us connect to the database
const db = require("../db/conn");

// Read
// This section will help you get a list of all the documents.
clinicRoutes.route("/daycare").get(async function (req, res) {
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

// Get Clinic by Id
clinicRoutes.route("/daycare/:daycare_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    const daycare = await dbConnect
      .collection("daycareDetails")
      .findOne(toId(req.params.daycare_id));
    res.send(daycare);
  } catch {
    res.status(404);
    res.send({ error: "Daycare doesn't exist!" });
  }
});
// });

// This section will help you create a new document.
clinicRoutes.route("/daycare/create").post(async (req, res) => {
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
clinicRoutes.route("/daycare/update/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const updates = {
    $set: {
      approvalStatus: req.body.approvalStatus,
      appointmentList: req.body.appointmentList,
      reviews: req.body.reviews,
    },
  };
  const daycareId = toId(req.params.id);
  console.log(toId(req.params.id));
  const daycare = await Daycare.findById(daycareId);

  await dbConnect.collection("daycareDetails").findOneAndUpdate(
    { _id: daycareId },
    updates,
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
    (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating on daycare!`);
      } else {
        daycare.save();
        res.status(200).send(updates);
      }
    }
  );
});

// This section will help you delete a clinic.
clinicRoutes.route("/daycare/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    await dbConnect
      .collection("daycareDetails")
      .deleteOne({ clinic_id: req.params.id });
    res.status(200).send("daycare has been deleted!");
  } catch {
    res.status(404).send({ error: "Daycare doesn't exist!" });
  }
});

module.exports = clinicRoutes;



