const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  id: String,
  password: String,
  wallet: { btc: Number },
  bets: [{ round: Number, usd: Number, btc: Number, timestamp: Date }]
});

module.exports = mongoose.model("Player", playerSchema);
