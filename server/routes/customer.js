const express = require("express");
const { Staff } = require("../models/staffModel");
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;
mongoose.set("strictQuery", false);
const db = require("../db/conn");
const { ObjectID } = require("bson");
const { Customer } = require("../models/customerModel");

const customerRoutes = express.Router();

customerRoutes.route("/customer").get(async (req, res) => {
  const dbConnect = db.getDb();

  dbConnect
    .collection("customerDetails")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching customer!");
      } else {
        res.json(result);
      }
    });
});

customerRoutes.route("/customer/:customer_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    const customer = await dbConnect
      .collection("customerDetails")
      .findOne(toId(req.params.customer_id));
    res.send(customer);
  } catch {
    res.status(404);
    res.send({ error: "Customer doesn't exist!" });
  }
});

customerRoutes.route("/customer/create/:customer_id").post(async (req, res) => {
  const dbConnect = db.getDb();
  const create = await Customer.create({
    ...req.body,
  });
  dbConnect
    .collection("customerDetails")
    .insertOne(create, (err, result) => {
      if (err) {
        res.status(400).send("Error inserting customer!");
      } else {
        return res.status(201).json(create);
      }
    });
});

// This section will help you update a document by id.
customerRoutes.route("/customer/update/:customer_id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const customer_id = req.params.customer_id;
  const updates = {
    $set: {
      ...req.body,
    },
  };
  await dbConnect
    .collection("customerDetails")
    .updateOne({ customer_id: customer_id }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating on customer!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

customerRoutes.route("/customer/get/:customer_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  const customer_id = req.params.customer_id;
  try {
    const customer = await dbConnect
      .collection("customerDetails")
      .findOne({ customer_id: customer_id });
    res.send(customer);
  } catch {
    res.status(404);
    res.send({ error: "customer doesn't exist!" });
  }
});

customerRoutes.route("/customer/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  const customerid = toId(req.params.id);
  try {
    await dbConnect
      .collection("customerDetails")
      .deleteOne({ _id: customerid });
    res.status(200).send("customer has been deleted!");
  } catch {
    res.status(404).send({ error: "customer doesn't exist!" });
  }
});

module.exports = customerRoutes;
