const { Schema, model } = require("mongoose");
const uuid = require("uuid");

const EventSchema = new Schema(
  {
    event: {
      type: Number,
      required: false,
    },
    appointment_id: { type: Schema.ObjectId, ref: "Appointment" },
    date: {
      type: Date,
      required: false,
    },
    startTime: {
      type: Date,
      required: false,
    },
    endTime: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      required: false,
      default: "Approved",
    },
  },
  {
    timestamps: true,
  }
);

const Event = model("Event", EventSchema);

module.exports = { Event };