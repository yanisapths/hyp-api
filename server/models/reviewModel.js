const {Schema,model} = require("mongoose");
const uuid = require("uuid");

const ReviewSchema = new Schema({
  review_id: {
    type: String,
    default: function genUUID() {
      return uuid.v4();
    },
    required: true,
  },
  customerName: {
    type: String,
  },
  comments: { 
    type: String
  },
  score: { 
    type: String
  },
  status: {
    type: String,
  },
  clinic_id: { type: Schema.ObjectId, ref: "Clinic" },
},{
  timestamps: true
});

const Review = model("Review", ReviewSchema);

module.exports = { Review };
