const mongoose = require("mongoose");
const uuid = require("uuid");

const DaycareSchema = new mongoose.Schema({
  daycare_id: {
    type: String,
    default: function genUUID() {
      return uuid.v1();
    },
    required: true,
  },
  daycare_name: {
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
  appointmentList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }], required: false,default:[],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], required: false,default:[],
});

module.exports = mongoose.model("Daycare", DaycareSchema);