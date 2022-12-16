const {Schema,model} = require("mongoose");
const uuid = require("uuid");

const ClinicSchema = new Schema({
  clinic_id: {
    type: String,
    default: function genUUID() {
      return uuid.v1();
    },
    required: true,
  },
  clinic_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
    },
    required: false,
    default:{},
    coordinates: [],
  },
  owner: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
    required: false,
  },
  approvalStatus: {
    type: String,
    required: false,
    default: "Unautorized",
  },
  reviews: [{ type: Schema.ObjectId, ref: "Review" }],
  appointmentList: [{ type: Schema.ObjectId, ref: "Appointment" }], 
});

const Clinic = model("Clinic", ClinicSchema);

module.exports = { Clinic };
