const mongoose = require("mongoose");
const uuid = require("uuid");

const AppointmentSchema = new mongoose.Schema({
  appointment_id: {
    type: String,
    default: function genUUID() {
      return uuid.v1();
    },
    required: true,
  },
  customerName: {
    type: String,
  },
  date: {
    type: Date,
  },
  phoneNumber: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  daycare_name: { type: String, ref: "Daycare" },
  daycare_id: { type: String, ref: "Daycare" },
  status: {
    type: String,
    default: "pending",
  },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = { Appointment };
