const express = require("express");
const { Event } = require("../models/eventModel");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
mongoose.set("strictQuery", false);
const { ObjectID } = require("bson");

// eventRoutes is an instance of the express router.
const eventRoutes = express.Router();

// This will help us connect to the database
const db = require("../db/conn");

// Read
// This section will help you get a list of all the documents.
eventRoutes.route("/event").get(async function (req, res) {
  const dbConnect = db.getDb();

  dbConnect
    .collection("appointmentEvent")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching events!");
      } else {
        res.json(result);
      }
    });
});

eventRoutes.route("/event/match/:appointment_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  const appointmentId = toId(req.params.appointment_id);
  try {
    await dbConnect
      .collection("appointmentEvent")
      .aggregate([{ $match: { appointment_id: new ObjectID(appointmentId) } }])
      .toArray((err, result) => {
        res.send(result);
      });
  } catch {
    res.status(404);
    res.send({ error: "Failed to fetch" });
  }
});

eventRoutes
  .route("/event/match/owner/:session_userId")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    const session_userId = req.params.session_userId;
    try {
      await dbConnect
        .collection("appointmentEvent")
        .aggregate([{ $match: { owner_id: session_userId } }])
        .toArray((err, result) => {
          res.send(result);
        });
    } catch {
      res.status(404);
      res.send({ error: "Failed to fetch clinic's events" });
    }
  });

eventRoutes
  .route("/event/match/owner/:session_userId")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    const session_userId = req.params.session_userId;
    try {
      await dbConnect
        .collection("appointmentEvent")
        .aggregate([{ $match: { owner_id: session_userId } }])
        .toArray((err, result) => {
          res.send(result);
        });
    } catch {
      res.status(404);
      res.send({ error: "Failed to fetch clinic's events" });
    }
  });

// Get course by clinic_id
eventRoutes.route("/event/match/clinic/:clinic_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.clinic_id);
  try {
    await dbConnect
      .collection("appointmentEvent")
      .aggregate([{ $match: { clinic_id: new ObjectID(clinicId) } }])
      .toArray((err, result) => {
        res.send(result);
      });
  } catch {
    res.status(404);
    res.send({ error: "Failed to fetch clinic's events" });
  }
});

// Get Event by id
eventRoutes.route("/event/:event_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    const event = await dbConnect
      .collection("appointmentEvent")
      .findOne(toId(req.params.event_id));
    res.send(event);
  } catch {
    res.status(404);
    res.send({ error: "Event doesn't exist!" });
  }
});

eventRoutes.route("/event/create/:appointment_id").post(async (req, res) => {
  const dbConnect = db.getDb();
  const appointmentId = toId(req.params.appointment_id);
  const create = await Event.create({
    appointment_id: appointmentId,
    ...req.body,
  });
  dbConnect.collection("appointmentEvent").insertOne(create, (err, result) => {
    if (err) {
      res.status(400).send("Error inserting event!");
    } else {
      return res.status(201).json(create);
    }
  });
});

// This section will help you update a document by id.
eventRoutes.route("/event/update/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const eventId = toId(req.params.id);
  const updates = {
    $set: {
      status: req.body.status,
    },
  };
  await dbConnect
    .collection("appointmentEvent")
    .updateOne({ _id: eventId }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating on event!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// This section will help you delete a event.
eventRoutes.route("/event/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  const eventId = toId(req.params.id);
  try {
    await dbConnect.collection("appointmentEvent").deleteOne({ _id: eventId });
    res.status(200).send("Event has been deleted!");
  } catch {
    res.status(404).send({ error: "Event doesn't exist!" });
  }
});

module.exports = eventRoutes;
