const {Schema,model} = require("mongoose");
const uuid = require("uuid");

const ScheduleSchema = new Schema({
  schedule_id: {
    type: String,
    default: function genUUID() {
      return uuid.v1();
    },
    required: true,
  },
  availableDate: {
    type: Date,
    required: false,
  },
  endTime: {
    type: Date,
    required: false,
  },
  startTime: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    default: "available",
  },
  owner_id: { type: String, ref: "Clinic"},
  clinic_id: { type: Schema.ObjectId, ref: "Clinic" },
  appointment_id: { type: Schema.ObjectId, ref: "Appointment" },
});

const Schedule = model("Schedule", ScheduleSchema);

module.exports = { Schedule };
