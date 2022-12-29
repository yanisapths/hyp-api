const {Schema,model} = require("mongoose");
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
  customerName: {
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
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  clinic_id: { type: Schema.ObjectId, ref: "Clinic" },
  status: {
    type: String,
    default: "pending",
  },
});

const Appointment = model("Appointment", AppointmentSchema);

module.exports = { Appointment };
