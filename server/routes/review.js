const express = require("express");
const { Review } = require("../models/reviewModel")
const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;

// daycareRoutes is an instance of the express router.
const reviewRoutes = express.Router();

// This will help us connect to the database
const db = require("../db/conn");

// Read
// This section will help you get a list of all the documents.
reviewRoutes.route("/review").get(async function (req, res) {
  const dbConnect = db.getDb();

  dbConnect
    .collection("daycareReviews")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching reviews!");
      } else {
        res.json(result);
      }
    });
});

  // Get Review by daycare id
  appointmentRoutes
  .route("/review/match/:daycare_id")
  .get(async (req, res) => {
    const dbConnect = db.getDb();
    const daycareId = toId(req.params.daycare_id);
    try {
      await dbConnect
        .collection("daycareReviews")
        .aggregate([
          { $match: { 'daycare_id': new ObjectID(daycareId)} 
        }
      ]).toArray( (err , result) => {
        res.send(result);
      })
  
    } catch {
      res.status(404);
      res.send({ error: "Failed to fetch daycare's reviews"});
    }
  });

// Get Review by id
reviewRoutes.route("/review/:review_id").get(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    const review = await dbConnect
      .collection("daycareReviews")
      .findOne(toId(req.params.review_id));
    res.send(review);
  } catch {
    res.status(404);
    res.send({ error: "Review doesn't exist!" });
  }
});

// This section will help you create a new document.
reviewRoutes.route("/review/create").post(async (req, res) => {
  const dbConnect = db.getDb();
 const create = await Review.create(req.body);
  dbConnect.collection("daycareReviews").insertOne(create, (err, result) => {
    if (err) {
      res.status(400).send("Error inserting review!");
    } else {
      return res.status(201).json(create);
    }
  });
});

// This section will help you update a document by id.
reviewRoutes.route("/review/update/:id").put(async (req, res) => {
  const dbConnect = db.getDb();
  const updates = {
    $set: {
      comments: req.body.comments,
    },
  };
  await dbConnect
    .collection("daycareReviews")
    .updateOne({ review_id: req.params.id }, updates, (err, _result) => {
      if (err) {
        res.status(400).send(`Error updating on review!`);
      } else {
        res.status(200).send(updates);
      }
    });
});

// This section will help you delete a review.
reviewRoutes.route("/review/delete/:id").delete(async (req, res) => {
  const dbConnect = db.getDb();
  try {
    await dbConnect
      .collection("daycareReviews")
      .deleteOne({ review_id: req.params.id });
    res.status(200).send("Review has been deleted!");
  } catch {
    res.status(404).send({ error: "Review doesn't exist!" });
  }
});

module.exports = reviewRoutes;
