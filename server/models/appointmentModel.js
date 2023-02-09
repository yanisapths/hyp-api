const { Schema, model, mongoose } = require("mongoose");
const uuid = require("uuid");

// const EventSchema = mongoose.Schema(
//   {
//     event: {
//       type: Number,
//       required: false,
//     },
//     date: {
//       type: Date,
//       required: false,
//     },
//     startTime: {
//       type: Date,
//       required: false,
//     },
//     endTime: {
//       type: Date,
//       required: false,
//     },
//     status: {
//       type: String,
//       required: false,
//       default: "Approved",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

const AppointmentSchema = new Schema(
  {
    appointment_id: {
      type: String,
      default: function genUUID() {
        return uuid.v1();
      },
      required: true,
    },
    customer_id: {
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
    appointmentPlace: {
      type: String,
    },
    appointmentDate: {
      type: Date,
      default: Date.now,
    },
    appointmentTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: Date.now,
      require: false,
    },
    phoneNumber: {
      type: String,
    },
    location: {
      type: String,
      require: false,
    },
    lineId: {
      type: String,
      require: false,
    },
    sex: {
      type: String,
      require: false,
    },
    age: {
      type: String,
      require: false,
    },
    rejectReason: { type: String, require: false },
    tag: { type: String, require: false },
    owner_id: { type: String, ref: "Clinic" },
    course_id: { type: String, ref: "Course" },
    clinicName: { type: String },
    clinic_id: { type: Schema.ObjectId, ref: "Clinic" },
    patient_id: { type: String, ref: "Patient" },
    status: {
      type: String,
      default: "pending",
    },
    events: [{ type: Schema.ObjectId, ref: "Event" }],
  },
  {
    timestamps: true,
  }
);

const Appointment = model("Appointment", AppointmentSchema);

module.exports = { Appointment };
