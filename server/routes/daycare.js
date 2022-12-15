const express = require("express");
const { Daycare } = require("../models/daycareModel");
const { Review } = require("../models/reviewModel");
const { Appointment } = require("../models/appointmentModel");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;

// daycareRoutes is an instance of the express router.
const daycareRoutes = express.Router();

// This will help us connect to the database
const db = require("../db/conn");

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

// Get daycare's appointment
daycareRoutes
  .route("/daycare/:daycare_id/:appointment")
  .get(async function (req, res) {
    const daycareId = toId(req.params.daycare_id);
    const appointment = toId(req.params.appointment);
    const daycare = await Daycare.findById(daycareId);
    daycare.appointmentList = appointment;
    try {
      const populated = await daycare.populate({path: "appointmentList", model: Appointment});
      daycare.save();
      res.send(populated);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

// Get daycare's review
daycareRoutes
  .route("/daycare/:daycare_id/review/:review_id")
  .get(async (req, res) => {
    const daycareId = toId(req.params.daycare_id);
    const review = toId(req.params.review_id);
    const daycare = await Daycare.findById(daycareId);
    daycare.reviews = review;
    try {
      const populated = await daycare.populate({path: "reviews", model: Review});
      daycare.save();
      res.send(populated);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

// Get Daycare by Id
// daycareRoutes.route("/daycare/:daycare_id").get(async (req, res) => {
//   const dbConnect = db.getDb();
//   try {
//     const daycare = await dbConnect
//       .collection("daycareDetails")
//       .findOne(toId(req.params.daycare_id));
//     res.send(daycare);
//   } catch {
//     res.status(404);
//     res.send({ error: "Daycare doesn't exist!" });
//   }
// });

// Get Daycare by Id
daycareRoutes.route("/daycares/daycare/:id").get(async (req, res) => {
  const dbConnect = db.getDb();
  const daycareId = toId(req.params.id);

  try {
    const daycare = await dbConnect.collection("daycareDetails").findOne({daycareId});
    try {
      const populated = await Daycare.findById(daycareId).populate({
        path: "appointmentList",
        model: Appointment,
      })
      .populate({
        path: "reviews",
        model: Review,
      });
      res.json(populated);
    } catch (err) {
      res.status(404).send(err.message);
    }
  } catch {
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
