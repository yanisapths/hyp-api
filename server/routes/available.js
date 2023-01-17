const express = require("express");
const { Available } = require("../models/AvailableModel");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
mongoose.set("strictQuery", false);

// availableRoutes is an instance of the express router.
const availableRoutes = express.Router();
// This will help us connect to the database
const db = require("../db/conn");
const { ObjectID } = require("bson");

// Read
// This section will help you get a list of all the documents.
availableRoutes.route("/available").get(async (req, res) => {
  const dbConnect = db.getDb();

  dbConnect
    .collection("availableSlot")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching availables!");
      } else {
        res.json(result);
      }
    });
});

// Get available by id
availableRoutes.route("/available/:schedule_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    const available = await dbConnect
      .collection("availableSlot")
      .findOne(toId(req.params.schedule_id));
    res.send(available);
  } catch {
    res.status(404);
    res.send({ error: "available doesn't exist!" });
  }
});

// Get schedule by clinic id
availableRoutes.route("/available/match/:clinic_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.clinic_id);
  try {
    await dbConnect
      .collection("availableSlot")
      .aggregate([{ $match: { clinic_id: new ObjectID(clinicId) } }])
      .toArray((err, result) => {
        res.send(result);
      });
  } catch {
    res.status(404);
    res.send({ error: "Failed to fetch clinic's available" });
  }
});

// Get schedule by clinic owner's session
availableRoutes
  .route("/available/match/owner/:session_userId")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    const session_userId = req.params.session_userId;
    try {
      await dbConnect
        .collection("availableSlot")
        .aggregate([{ $match: { owner_id: session_userId } }])
        .toArray((err, result) => {
          res.send(result);
        });
    } catch {
      res.status(404);
      res.send({ error: "Failed to fetch clinic's available" });
    }
  });

// This section will help you create a new document.
availableRoutes.route("/available/create/:clinic_id").post(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.clinic_id);
  const create = await Available.create({
    ...req.body,
    clinic_id: clinicId,
  });
  dbConnect.collection("availableSlot").insertOne(create, (err, result) => {
    if (err) {
      res.status(400).send("Error inserting available!");
    } else {
      return res.status(201).json(create);
    }
  });
});

// This section will help you update a document by id.
availableRoutes.route("/available/update/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const availableId = toId(req.params.id);
  const updates = {
    $set: {
      ...req.body,
    },
  };
  await dbConnect
    .collection("availableSlot")
    .updateOne({ _id: availableId }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating on available!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// This section will help you delete an available.
availableRoutes.route("/available/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  const availableId = toId(req.params.id);
  try {
    await dbConnect.collection("availableSlot").deleteOne({ _id: availableId });
    res.status(200).send("available has been deleted!");
  } catch {
    res.status(404).send({ error: "available doesn't exist!" });
  }
});

module.exports = availableRoutes;
