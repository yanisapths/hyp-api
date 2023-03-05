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
    bodyChart: { type: String, require: false },
    note: { type: String, require: false},
    owner_id: { type: String, ref: "Clinic" },
    patient_id: { type: String, ref: "Patient" },
    course_id: { type: String, ref: "Course" },
    clinic_id: { type: Schema.ObjectId, ref: "Clinic" },
  },
  {
    timestamps: true,
  }
);

const Event = model("Event", EventSchema);

module.exports = { Event };
