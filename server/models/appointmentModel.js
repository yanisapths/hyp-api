const { Schema, model } = require("mongoose");
const uuid = require("uuid");

const AppointmentSchema = new Schema({
  appointment_id: {
    type: String,
    default: function genUUID() {
      return uuid.v1();
    },
    required: true,
  },
  created_At: {
    type: Date,
    default: Date.now,
    required: true,
  },
  customer_id: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  nickname: {
    type: String,
  },
  appointmentPlace: {
    type: String,
  },
  appointmentDate: {
    type: Date,
    default: Date.now,
  },
  appointmentTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    default: Date.now,
    require: false 
  },
  phoneNumber: {
    type: String,
  },
  location: {
    type: String,
    require: false,
  },
  rejectReason: { type: String, require: false },
  tag: { type: String, require: false },
  owner_id: { type: String, ref: "Clinic" },
  course_id: { type: String, ref: "Course" },
  clinicName: { type: String },
  clinic_id: { type: Schema.ObjectId, ref: "Clinic" },
  status: {
    type: String,
    default: "pending",
  },
});

const Appointment = model("Appointment", AppointmentSchema);

module.exports = { Appointment };
