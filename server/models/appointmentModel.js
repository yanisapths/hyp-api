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
  dateStart: {
    type: Date,
    required: false,
  },
  dateEnd: {
    type: Date,
    required: false,
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
  daycare_id: { type: mongoose.Schema.Types.ObjectId, ref: "Daycare" },
  status: {
    type: String,
    default: "pending",
  },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = { Appointment };
