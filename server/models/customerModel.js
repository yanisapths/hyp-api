const { Schema, model } = require("mongoose");
const uuid = require("uuid");

const CustomerSchema = new Schema(
  {
    customer_id: {
      type: String,
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
    age: {
      type: String,
      require: false,
    },
    sex: {
      type: String,
      require: false,
    },
    description: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = model("Customer", CustomerSchema);

module.exports = { Customer };
