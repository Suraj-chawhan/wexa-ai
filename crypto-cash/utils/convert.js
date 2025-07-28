const axios = require("axios");
let cachedPrices = {};
let lastPriceFetch = 0;

async function convertUSDToCrypto(usd, symbol = "bitcoin") {
  const now = Date.now();
  if (!cachedPrices[symbol] || now - lastPriceFetch > 10000) {
    const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`);
    cachedPrices[symbol] = res.data[symbol].usd;
    lastPriceFetch = now;
  }
  return usd / cachedPrices[symbol];
}

module.exports = convertUSDToCrypto;
