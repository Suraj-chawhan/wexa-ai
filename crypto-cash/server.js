require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const connectDB = require("./db");
const Player = require("./models/Player");
const { startGameRound, getCurrentGame, getRoundNumber } = require("./services/gameEngine");
const convertUSDToCrypto = require("./utils/convert");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));

let currentGame;
let roundNumber;

startGameRound(wss, (game, round) => {
  currentGame = game;
  roundNumber = round;
});

wss.on("connection", (ws) => {
  console.log("🌐 WebSocket connected");

  ws.on("message", async (msg) => {
    const data = JSON.parse(msg);
    if (data.type === "join") {
      let player = await Player.findOne({ id: data.playerId });
      if (!player) {
        player = await Player.create({ id: data.playerId, password: "demo", wallet: { btc: 0.01 }, bets: [] });
      }
      ws.send(JSON.stringify({ type: "joined", player }));
    }

    if (data.type === "bet") {
      const player = await Player.findOne({ id: data.playerId });
      const cryptoAmt = await convertUSDToCrypto(data.usd);
      if (player.wallet.btc >= cryptoAmt) {
        player.wallet.btc -= cryptoAmt;
        player.bets.push({ round: roundNumber, usd: data.usd, btc: cryptoAmt, timestamp: new Date() });
        await player.save();
        currentGame.bets.push({ playerId: data.playerId, usd: data.usd, btc: cryptoAmt, cashedOut: false });
        ws.send(JSON.stringify({ type: "bet_placed", cryptoAmt }));
      } else {
        ws.send(JSON.stringify({ type: "error", msg: "Not enough balance" }));
      }
    }

    if (data.type === "cashout" && !currentGame.isCrashed) {
      const bet = currentGame.bets.find(b => b.playerId === data.playerId && !b.cashedOut);
      if (bet) {
        const payout = bet.btc * currentGame.multiplier;
        await Player.updateOne({ id: data.playerId }, { $inc: { "wallet.btc": payout } });
        bet.cashedOut = true;
        currentGame.cashouts.push({ playerId: data.playerId, payout });
        wss.clients.forEach(ws => {
          if (ws.readyState === 1) {
            ws.send(JSON.stringify({
              type: "cashout",
              playerId: data.playerId,
              payout: payout.toFixed(6),
              multiplier: currentGame.multiplier.toFixed(2)
            }));
          }
        });
      }
    }
  });
});




server.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));
