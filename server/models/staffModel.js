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
  position: {
    type: String,
    required: false,
  },
  clinic_id: { type: Schema.ObjectId, ref: "Clinic" },
  owner_id: { type: String, ref: "Clinic"},
  staffImage: {
    type: String,
  },
},{
  timestamps: true
});

const Staff = model("Staff", StaffSchema);

module.exports = { Staff };
