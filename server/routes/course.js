const express = require("express");
const { Course } = require("../models/courseModel");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
mongoose.set("strictQuery", false);

// courseRoutes is an instance of the express router.
const courseRoutes = express.Router();
// This will help us connect to the database
const db = require("../db/conn");
const { ObjectID } = require("bson");

// Read
// This section will help you get a list of all the documents.
courseRoutes.route("/course").get(async (req, res) => {
  const dbConnect = db.getDb();

  dbConnect
    .collection("clinicCourseDetails")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching course!");
      } else {
        res.json(result);
      }
    });
});

// Get course by id
courseRoutes
  .route("/course/:course_id")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    try {
      const course = await dbConnect
        .collection("clinicCourseDetails")
        .findOne(toId(req.params.course_id));
      res.send(course);
    } catch {
      res.status(404);
      res.send({ error: "course doesn't exist!" });
    }
  });

// Get course by clinic owner id
courseRoutes
  .route("/course/match/owner/:session_userId")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    const session_userId = req.params.session_userId;
    try {
      await dbConnect
        .collection("clinicCourseDetails")
        .aggregate([
          { $match: { 'owner_id': session_userId} 
        }
      ]).toArray( (err,result)=> {
        res.send(result);
      })
  
    } catch {
      res.status(404);
      res.send({ error: "Failed to fetch clinic's course"});
    }
  });

// This section will help you create a new document.
courseRoutes.route("/course/create/:clinic_id").post(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.clinic_id);
  const procedures =  req.body.procedures;
  const create = await Course.create({
    courseName: req.body.courseName,
    amount: req.body.amount,
    duration: req.body.duration,
    totalPrice: req.body.totalPrice,
    owner_id: req.body.owner_id,
    procedures: procedures,
    clinic_id: clinicId,
  });
  dbConnect.collection("clinicCourseDetails").insertOne(create, (err, result) => {
    if (err) {
      res.status(400).send("Error inserting course!");
    } else {
      return res.status(201).json(create);
    }
  });
});

// This section will help you update a document by id.
courseRoutes.route("/course/update/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const courseId = toId(req.params.id);
  const updates = {
    $set: {
        courseName: req.body.courseName,
        amount: req.body.amount,
        duration: req.body.duration,
        totalPrice: req.body.totalPrice,
    },
  };
  await dbConnect
    .collection("clinicCourseDetails")
    .updateOne({ _id: courseId }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating on course!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// This section will help you delete an appointment.
courseRoutes.route("/course/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  const courseId = toId(req.params.id);
  try {
    await dbConnect
      .collection("clinicCourseDetails")
      .deleteOne({ _id: courseId });
    res.status(200).send("course has been deleted!");
  } catch {
    res.status(404).send({ error: "course doesn't exist!" });
  }
});

module.exports = courseRoutes;
