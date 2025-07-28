const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  round: Number,
  crashPoint: Number,
  bets: Array,
  cashouts: Array,
  isCrashed: Boolean,
  startTime: Number
});

module.exports = mongoose.model("Round", roundSchema);
