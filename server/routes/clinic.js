const express = require("express");
const { Clinic } = require("../models/clinicModel");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
const { ObjectID } = require("bson");
mongoose.set("strictQuery", false);

// clinicRoutes is an instance of the express router.
const clinicRoutes = express.Router();

// This will help us connect to the database
const db = require("../db/conn");

// Read
// This section will help you get a list of all the documents.
clinicRoutes.route("/clinic").get(async function (req, res) {
  const dbConnect = db.getDb();
  dbConnect
    .collection("daycareDetails")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching clinics!");
      } else {
        res.json(result);
      }
    });
});

// Get Clinic by Id
clinicRoutes.route("/clinic/:clinic_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    const clinic = await dbConnect
      .collection("daycareDetails")
      .findOne(toId(req.params.clinic_id));
    res.send(clinic);
  } catch {
    res.status(404);
    res.send({ error: "Clinic doesn't exist!" });
  }
});
// });

// This section will help you create a new document.
clinicRoutes.route("/clinic/create").post(async (req, res) => {
  const dbConnect = db.getDb();
  const time = new Date();

  const create = new Clinic({
    clinic_name: req.body.clinic_name,
    owner: req.body.owner,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    description: req.body.description,
    price: req.body.price,
    email: req.body.email,
    imageUrl: req.body.imageUrl,
    location: req.body.location,
    openDay: req.body.openDay,
    openTime: req.body.openTime,
    closeTime: req.body.closeTime,
    ownerImageUrl: req.body.ownerImageUrl,
    ownerContact: req.body.ownerContact,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    businessLicense: req.body.businessLicense,
    professionalLicense: req.body.professionalLicense,
    owner_id: req.body.owner_id
  });
  dbConnect.collection("daycareDetails").insertOne(create, (err, result) => {
    if (err) {
      res.status(400).send("Error inserting clinic!");
    } else {
      return res.status(201).send(create);
    }
  });
});

clinicRoutes.route("/clinic/profile/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.id);
  const updates = {
    $set: {
     ownerImageUrl: req.body.ownerImageUrl
    },
  };
  await dbConnect
    .collection("daycareDetails")
    .updateOne({ _id: clinicId }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// This section will help you update a document by id.
clinicRoutes.route("/clinic/update/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.id);
  const updates = {
    $set: {
      ...req.body,
    },
  };
  await dbConnect
  .collection("daycareDetails")
  .updateOne({ _id: clinicId }, updates, (err, _result) => {
    if (err) {
      res.status(400).send(`Error updating!`);
    } else {
      res.status(200).send(updates);
    }
  });
});

/// Authorized Clinic by Olive Approver ///
clinicRoutes.route("/clinic/approve/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const updates = {
    $set: {
      approvalStatus: req.body.approvalStatus,
    },
  };
  const clinicId = toId(req.params.id);
  await dbConnect
    .collection("daycareDetails")
    .updateOne({ _id: clinicId }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error approving clinic!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// This section will help you delete a clinic.
clinicRoutes.route("/clinic/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  const clinicId = toId(req.params.id);
  try {
    await dbConnect.collection("daycareDetails").deleteOne({ _id: clinicId });
    res.status(200).send("clinic has been deleted!");
  } catch {
    res.status(404).send({ error: "clinic doesn't exist!" });
  }
});

// Get clinic by owner id
clinicRoutes.route("/clinic/owner/:owner_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  const owner_id = req.params.owner_id;
  try {
    const clinic = await dbConnect
      .collection("daycareDetails")
      .findOne({ owner_id: owner_id });
    res.send(clinic);
  } catch {
    res.status(404);
    res.send({ error: "Clinic doesn't exist!" });
  }
});

module.exports = clinicRoutes;
