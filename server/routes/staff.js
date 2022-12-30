const express = require("express");
const { Staff } = require("../models/staffModel");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
mongoose.set("strictQuery", false);

// staffRoutes is an instance of the express router.
const staffRoutes = express.Router();
// This will help us connect to the database
const db = require("../db/conn");
const { ObjectID } = require("bson");

// Read
// This section will help you get a list of all the documents.
staffRoutes.route("/staff").get(async (req, res) => {
  const dbConnect = db.getDb();

  dbConnect
    .collection("clinicStaffDetails")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching staffs!");
      } else {
        res.json(result);
      }
    });
});

// Get Staff by id
staffRoutes
  .route("/staff/:staff_id")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    try {
      const staff = await dbConnect
        .collection("clinicStaffDetails")
        .findOne(toId(req.params.staff_id));
      res.send(staff);
    } catch {
      res.status(404);
      res.send({ error: "Staff doesn't exist!" });
    }
  });

  // Get staff by clinic id
staffRoutes
.route("/staff/match/:clinic_id")
.get(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.clinic_id);
  try {
    await dbConnect
      .collection("clinicStaffDetails")
      .aggregate([
        { $match: { 'clinic_id': new ObjectID(clinicId)} 
      }
    ]).toArray( (err,result)=> {
      res.send(result);
    })

  } catch {
    res.status(404);
    res.send({ error: "Failed to fetch clinic's staff"});
  }
});

// This section will help you create a new document.
staffRoutes.route("/staff/create/:clinic_id").post(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.clinic_id);
  const create = await Staff.create({
    staffName: req.body.staffName,
    phoneNumber: req.body.phoneNumber,
    position: req.body.position,
    expertArea: req.body.expertArea,
    professionalLicense: req.body.professionalLicense,
    clinic_id: clinicId
  });
  dbConnect.collection("clinicStaffDetails").insertOne(create, (err, result) => {
    if (err) {
      res.status(400).send("Error inserting staff!");
    } else {
      return res.status(201).json(create);
    }
  });
});

// This section will help you update a document by id.
staffRoutes.route("/staff/update/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const staffId = toId(req.params.id);
  const updates = {
    $set: {
      ...req.body
    },
  };
  await dbConnect
    .collection("clinicStaffDetails")
    .updateOne({ _id: staffId }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating on staff!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// This section will help you delete an staff.
staffRoutes.route("/staff/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  const staffId = toId(req.params.id);
  try {
    await dbConnect
      .collection("clinicStaffDetails")
      .deleteOne({ _id: staffId });
    res.status(200).send("staff has been deleted!");
  } catch {
    res.status(404).send({ error: "staff doesn't exist!" });
  }
});

module.exports = staffRoutes;
