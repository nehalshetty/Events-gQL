const mongoose = require("mongoose");

let { Schema, model } = mongoose;

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Event", eventSchema);
