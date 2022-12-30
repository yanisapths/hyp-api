const { Schema, model } = require("mongoose");
const uuid = require("uuid");

const StaffSchema = new Schema({
  staff_id: {
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
  staffName: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  clinic_id: { type: Schema.ObjectId, ref: "Clinic" },
  position: {
    type: String,
    required: false,
  },
  expertArea: {
    type: String,
    required: false,
  },
  professionalLicense: {
    type: String,
    required: false,
  },
});

const Staff = model("Staff", StaffSchema);

module.exports = { Staff };
