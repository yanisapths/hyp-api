const express = require("express");
const { Patient } = require("../models/patientModel");
const mongoose = require("mongoose");
const multer = require("multer");
const toId = mongoose.Types.ObjectId;
mongoose.set("strictQuery", false);
const { ObjectID } = require("bson");
const uuidv4 = require("uuid");

// patientRoutes is an instance of the express router.
const patientRoutes = express.Router();

// This will help us connect to the database
const db = require("../db/conn");
const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

// Read
// This section will help you get a list of all the documents.
patientRoutes.route("/patient").get(async function (req, res) {
  const dbConnect = db.getDb();

  dbConnect
    .collection("clinicPatient")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching patients!");
      } else {
        res.json(result);
      }
    });
});

// Get Patient by clinic id
patientRoutes.route("/patient/match/:owner_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.clinic_id);
  try {
    await dbConnect
      .collection("clinicPatient")
      .aggregate([{ $match: { owner_id: req.params.owner_id } }])
      .toArray((err, result) => {
        res.send(result);
      });
  } catch {
    res.status(404);
    res.send({ error: "Failed to fetch clinic's patients" });
  }
});

// Get patient by id
patientRoutes.route("/patient/:patient_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    const patient = await dbConnect
      .collection("clinicPatient")
      .findOne(toId(req.params.patient_id));
    res.send(patient);
  } catch {
    res.status(404);
    res.send({ error: "patient doesn't exist!" });
  }
});

// Get patient by clinic_id
patientRoutes.route("/patient/match/clinic/:clinic_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.clinic_id);
  try {
    await dbConnect
      .collection("clinicPatient")
      .aggregate([{ $match: { clinic_id: new ObjectID(clinicId) } }])
      .toArray((err, result) => {
        res.send(result);
      });
  } catch {
    res.status(404);
    res.send({ error: "Failed to fetch clinic's patient" });
  }
});


patientRoutes
  .route("/patient/create/:owner_id")
  .post(upload.single("document"), async (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    const dbConnect = db.getDb();
    const create = await Patient.create({
      ...req.body,
      document: url + "/public/" + req.body.document,
    });
    dbConnect.collection("clinicPatient").insertOne(create, (err, result) => {
      if (err) {
        res.status(400).send("Error inserting patient!");
      } else {
        return res.status(201).json(create);
      }
    });
  });

// This section will help you update a document by id.
patientRoutes.route("/patient/update/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const patientId = toId(req.params.id);
  const updates = {
    $set: {
      ...req.body,
    },
  };
  await dbConnect
    .collection("clinicPatient")
    .updateOne({ _id: patientId }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating on patient!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// This section will help you delete a patient.
patientRoutes.route("/patient/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  const patientId = toId(req.params.id);
  try {
    await dbConnect.collection("clinicPatient").deleteOne({ _id: patientId });
    res.status(200).send("patient has been deleted!");
  } catch {
    res.status(404).send({ error: "patient doesn't exist!" });
  }
});

module.exports = patientRoutes;
