const { Schema, model } = require("mongoose");
const uuid = require("uuid");

const PatientSchema = new Schema(
  {
    patient_id: {
      type: String,
      default: function genUUID() {
        return uuid.v1();
      },
      required: false,
    },
  HN: {
    type: String,
    require: false,
  },
  firstName: {
    type: String,
    require: false,
  },
  lastName: {
    type: String,
    require: false,
  },
  nickName: {
    type: String,
    require: false,
  },
  lineId: {
    type: String,
    require: false,
  },
  phoneNumber: {
    type: String,
    require: false,
  },
  age:{
    type: String,
    require: false,
  },
  sex:{
    type: String,
    require: false,
  },
  occupation:{
    type: String,
    require: false,
  },
  position:{
    type: String,
    require: false,
  },
  education:{
    type: String,
    require: false,
  },
  income:{
    type: String,
    require: false,
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
  owner_id: { type: String, ref: "Clinic"},
  clinic_id: { type: Schema.ObjectId, ref: "Clinic" },
},
{
    timestamps: true
});

const Patient = model("Patient", PatientSchema);

module.exports = { Patient };
