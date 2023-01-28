const express = require("express");
const { Appointment } = require("../models/appointmentModel");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
mongoose.set("strictQuery", false);

// appointmentRoutes is an instance of the express router.
const appointmentRoutes = express.Router();
// This will help us connect to the database
const db = require("../db/conn");
const { ObjectID } = require("bson");

// Read
// This section will help you get a list of all the documents.
appointmentRoutes.route("/appointment").get(async (req, res) => {
  const dbConnect = db.getDb();

  dbConnect
    .collection("appointmentDetails")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching appointments!");
      } else {
        res.json(result);
      }
    });
});

// Get Appointment by id
appointmentRoutes
  .route("/appointment/:appointment_id")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    try {
      const appointment = await dbConnect
        .collection("appointmentDetails")
        .findOne(toId(req.params.appointment_id));
      res.send(appointment);
    } catch {
      res.status(404);
      res.send({ error: "Appointment doesn't exist!" });
    }
  });

// Get Appointment by clinic id
appointmentRoutes
  .route("/appointment/match/:clinic_id")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    const clinicId = toId(req.params.clinic_id);
    try {
      await dbConnect
        .collection("appointmentDetails")
        .aggregate([{ $match: { clinic_id: new ObjectID(clinicId) } }])
        .toArray((err, result) => {
          res.send(result);
        });
    } catch {
      res.status(404);
      res.send({ error: "Failed to fetch clinic's appoinments" });
    }
  });

// Get Appointment by clinic owner's email
appointmentRoutes
  .route("/appointment/match/owner/:session_userId")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    const session_userId = req.params.session_userId;
    try {
      await dbConnect
        .collection("appointmentDetails")
        .aggregate([{ $match: { owner_id: session_userId } }])
        .toArray((err, result) => {
          res.send(result);
        });
    } catch {
      res.status(404);
      res.send({ error: "Failed to fetch clinic's appoinments" });
    }
  });

appointmentRoutes
  .route("/appointment/match/customer/:customer_id")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    const customer_id = req.params.customer_id;
    try {
      await dbConnect
        .collection("appointmentDetails")
        .aggregate([{ $match: { customer_id: customer_id } }])
        .toArray((err, result) => {
          res.send(result);
        });
    } catch {
      res.status(404);
      res.send({ error: "Failed to fetch clinic's appoinments" });
    }
});

appointmentRoutes
  .route("/appointment/match/owner/:session_userId/approved")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    const session_userId = req.params.session_userId;
    try {
      await dbConnect
        .collection("appointmentDetails")
        .aggregate([
          { $match: { owner_id: session_userId, status: "Approved" } },
        ])
        .toArray((err, result) => {
          res.send(result);
        });
    } catch {
      res.status(404);
      res.send({ error: "Failed to fetch clinic's appoinments" });
    }
  });

appointmentRoutes
  .route("/appointment/match/owner/:session_userId/pending")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    const session_userId = req.params.session_userId;
    try {
      await dbConnect
        .collection("appointmentDetails")
        .aggregate([
          { $match: { owner_id: session_userId, status: "pending" } },
        ])
        .toArray((err, result) => {
          res.send(result);
        });
    } catch {
      res.status(404);
      res.send({ error: "Failed to fetch clinic's appoinments" });
    }
  });


// This section will help you create a new document.
appointmentRoutes
  .route("/appointment/create/:clinic_id")
  .post(async (req, res) => {
    const dbConnect = db.getDb();
    const clinicId = toId(req.params.clinic_id);
  
    const create = await Appointment.create({
      ...req.body,
      clinic_id: clinicId,
    });
    dbConnect
    .collection("appointmentDetails")
    .insertOne(create, (err, result) => {
      if (err) {
        res.status(400).send("Error inserting appointment!");
      } else {
        return res.status(201).json(create);
      }
    });
    
  });

// This section will help you update a document by id.
appointmentRoutes.route("/appointment/update/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const appoinmentId = toId(req.params.id);
  const updates = {
    $set: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nickname: req.body.nickname,
      phoneNumber: req.body.phoneNumber,
      appointmentPlace: req.body.appointmentPlace,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      clinic_id: req.body.clinic_id,
      status: req.body.status,
      course: req.body.course,
      location: req.body.location,
    },
  };
  await dbConnect
    .collection("appointmentDetails")
    .updateOne({ _id: appoinmentId }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating on appointment!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// Reject Request for appointment
appointmentRoutes.route("/appointment/reject/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const appoinmentId = toId(req.params.id);
  const updates = {
    $set: {
      status: req.body.status,
      rejectReason: req.body.rejectReason,
      tag: req.body.tag,
    },
  };
  await dbConnect
    .collection("appointmentDetails")
    .updateOne({ _id: appoinmentId }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error reject a request!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// Accept Request for appointment
appointmentRoutes.route("/appointment/accept/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const appoinmentId = toId(req.params.id);
  const updates = {
    $set: {
      status: req.body.status,
    },
  };
  await dbConnect
    .collection("appointmentDetails")
    .updateOne({ _id: appoinmentId }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error accept a request!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// This section will help you delete an appointment.
appointmentRoutes.route("/appointment/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  const appoinmentId = toId(req.params.id);
  try {
    await dbConnect
      .collection("appointmentDetails")
      .deleteOne({ _id: appoinmentId });
    res.status(200).send("Appointment has been deleted!");
  } catch {
    res.status(404).send({ error: "Appointment doesn't exist!" });
  }
});

module.exports = appointmentRoutes;
