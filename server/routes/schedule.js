const express = require("express");
const { Schedule } = require("../models/ScheduleModel");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
mongoose.set("strictQuery", false);

// scheduleRoutes is an instance of the express router.
const scheduleRoutes = express.Router();
// This will help us connect to the database
const db = require("../db/conn");
const { ObjectID } = require("bson");

// Read
// This section will help you get a list of all the documents.
scheduleRoutes.route("/schedule").get(async (req, res) => {
  const dbConnect = db.getDb();

  dbConnect
    .collection("scheduleSlot")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching schedules!");
      } else {
        res.json(result);
      }
    });
});

// Get schedule by id
scheduleRoutes.route("/schedule/:schedule_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    const schedule = await dbConnect
      .collection("scheduleSlot")
      .findOne(toId(req.params.schedule_id));
    res.send(schedule);
  } catch {
    res.status(404);
    res.send({ error: "schedule doesn't exist!" });
  }
});

// Get Appointment by clinic id
scheduleRoutes.route("/schedule/match/:clinic_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.clinic_id);
  try {
    await dbConnect
      .collection("scheduleSlot")
      .aggregate([{ $match: { clinic_id: new ObjectID(clinicId) } }])
      .toArray((err, result) => {
        res.send(result);
      });
  } catch {
    res.status(404);
    res.send({ error: "Failed to fetch clinic's schedule" });
  }
});

// Get schedule by clinic owner's session
scheduleRoutes
  .route("/schedule/match/owner/:session_userId")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    const session_userId = req.params.session_userId;
    try {
      await dbConnect
        .collection("scheduleSlot")
        .aggregate([{ $match: { owner_id: session_userId } }])
        .toArray((err, result) => {
          res.send(result);
        });
    } catch {
      res.status(404);
      res.send({ error: "Failed to fetch clinic's schedule" });
    }
  });

// This section will help you create a new document.
scheduleRoutes.route("/schedule/create/:clinic_id").post(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.clinic_id);
  const create = await Schedule.create({
    ...req.body,
    clinic_id: clinicId,
  });
  dbConnect.collection("scheduleSlot").insertOne(create, (err, result) => {
    if (err) {
      res.status(400).send("Error inserting schedule!");
    } else {
      return res.status(201).json(create);
    }
  });
});

// This section will help you update a document by id.
scheduleRoutes.route("/schedule/update/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const scheduleId = toId(req.params.id);
  const updates = {
    $set: {
      ...req.body,
    },
  };
  await dbConnect
    .collection("scheduleSlot")
    .updateOne({ _id: scheduleId }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating on schedule!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// This section will help you delete an schedule.
scheduleRoutes.route("/schedule/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  const scheduleId = toId(req.params.id);
  try {
    await dbConnect.collection("scheduleSlot").deleteOne({ _id: scheduleId });
    res.status(200).send("Schedule has been deleted!");
  } catch {
    res.status(404).send({ error: "Schedule doesn't exist!" });
  }
});

module.exports = scheduleRoutes;
