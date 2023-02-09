const {Schema,model,mongoose} = require("mongoose");
const uuid = require("uuid");

const ProcedureSchema = mongoose.Schema({
    procedureName: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: false,
    },
  });

const CourseSchema = new Schema({
  course_id: {
    type: String,
    default: function genUUID() {
      return uuid.v1();
    },
    required: true,
  },
  courseName: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: false,
  },
  duration: {
    type: String,
    required: false,
  },
  totalPrice: {
    type: String,
    required: false,
  },
  type: [{type: String,}],
  procedures: [ProcedureSchema],
  owner_id: { type: String, ref: "Clinic"},
  clinic_id: { type: Schema.ObjectId, ref: "Clinic" },
});

const Course = model("Course", CourseSchema);

module.exports = { Course };
