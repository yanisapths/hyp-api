const { Schema, model } = require("mongoose");
const uuid = require("uuid");

const PatientSchema = new Schema({
  patient_id: {
    type: String,
    default: function genUUID() {
      return uuid.v1();
    },
    required: true,
  },
  HN: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  nickName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  age:{
    type: String,
  },
  sex:{
    type: String,
  },
  occupation:{
    type: String,
  },
  position:{
    type: String,
  },
  education:{
    type: String,
  },
  income:{
    type: String,
  },
  address: {
    type: String,
    require: false,
  },
  chiefComplaint: {
    type: String,
    require: false,
  },
  diagnosis: {
    type: String,
    require: false,
  },
  precaution: {
    type: String,
    require: false,
  },
  document: {
    type: String,
    require: false,
  },
  clinic_id: { type: Schema.ObjectId, ref: "Clinic" },
},
{
    timestamps: true
});

const Patient = model("Patient", PatientSchema);

module.exports = { Patient };
