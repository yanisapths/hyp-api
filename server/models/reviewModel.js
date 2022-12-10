const mongoose = require("mongoose");
const uuid = require("uuid");

const ReviewSchema = new mongoose.Schema({
  review_id: {
    type: String,
    default: function genUUID() {
      return uuid.v4();
    },
    required: true,
  },
  customerName: {
    type: String,
  },
  date: {
    type: Date,
  },
  comments: { 
    type: String
  },
  appointment_id: { type: String, ref: "Appointment" },
  daycare_id: { type: String, ref: "Daycare" },
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = { Review };
