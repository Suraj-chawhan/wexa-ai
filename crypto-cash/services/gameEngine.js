const crypto = require("crypto");
const Round = require("../models/Round");

let roundNumber = 1;
let currentGame = null;

function generateCrashPoint(seed) {
  const hash = crypto.createHash("sha256").update(seed).digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);
  return Math.max(1.0, (num % 10000) / 1000);
}

function startGameRound(wss, setGameState) {
  const seed = `round-${roundNumber}`;
  const crashPoint = generateCrashPoint(seed);
  let multiplier = 1.0;
  let growthRate = 0.01;

  currentGame = {
    round: roundNumber,
    crashPoint,
    bets: [],
    cashouts: [],
    isCrashed: false,
    startTime: Date.now(),
  };

  wss.clients.forEach(ws => {
    if (ws.readyState === 1) ws.send(JSON.stringify({ type: "round_start", round: roundNumber }));
  });

  const interval = setInterval(() => {
    if (multiplier >= crashPoint) {
      currentGame.isCrashed = true;
      clearInterval(interval);
      Round.create(currentGame);
      wss.clients.forEach(ws => {
        if (ws.readyState === 1) ws.send(JSON.stringify({ type: "crash", multiplier: crashPoint }));
      });
      roundNumber++;
      setTimeout(() => startGameRound(wss, setGameState), 10000);
    } else {
      multiplier += growthRate;
      currentGame.multiplier = multiplier;
      wss.clients.forEach(ws => {
        if (ws.readyState === 1) ws.send(JSON.stringify({ type: "multiplier", multiplier: multiplier.toFixed(2) }));
      });
    }
  }, 100);

  setGameState(currentGame, roundNumber);
}

module.exports = { startGameRound, getCurrentGame: () => currentGame, getRoundNumber: () => roundNumber };
