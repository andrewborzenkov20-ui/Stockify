// Node.js script to fetch and save historical stock data for a list of symbols
// Usage: node fetch_stocks.js

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const API_KEY = 'H49EVTIFUV22L895';
const SYMBOLS = [
  "AAPL", "MSFT", "GOOG", "AMZN", "META", "TSLA", "NVDA", "BRK.B", "JPM", "V",
  "UNH", "HD", "PG", "MA", "LLY", "XOM", "MRK", "AVGO", "COST", "ABBV",
  "PEP", "KO", "ADBE", "WMT", "BAC", "MCD", "CVX", "ACN", "TMO", "ABT",
  "CSCO", "DHR", "LIN", "DIS", "VZ", "NFLX", "CRM", "NKE", "TXN", "NEE",
  "WFC", "INTC", "PM", "HON", "UNP", "BMY", "AMGN", "QCOM", "LOW", "MS",
  "ORCL", "MDT", "RTX", "IBM", "SBUX", "GE", "CAT", "GS", "BLK", "AMAT",
  "ISRG", "PLD", "NOW", "LMT", "T", "DE", "SPGI", "SYK", "ELV", "MDLZ",
  "ZTS", "CB", "ADI", "GILD", "MO", "MMC", "AXP", "C", "SCHW", "CI",
  "USB", "REGN", "ADP", "VRTX", "PNC", "SO", "CL", "DUK", "TGT", "BDX",
  "PGR", "SHW", "FISV", "ITW", "EW", "CSX", "FDX", "AON", "HUM", "BKNG"
];

const DATA_DIR = path.join(__dirname, 'public', 'stock-data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

async function fetchStock(symbol) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data["Time Series (Daily)"]) {
    console.log(`Error fetching ${symbol}:`, data);
    return null;
  }
  return data;
}

(async () => {
  let fetched = 0;
  for (let i = 0; i < SYMBOLS.length; i++) {
    const symbol = SYMBOLS[i];
    const outPath = path.join(DATA_DIR, `${symbol.replace('.', '_')}.json`);
    if (fs.existsSync(outPath)) {
      console.log(`Skipped (already exists): ${symbol}`);
      continue;
    }
    console.log(`Fetching ${symbol} (${i + 1}/${SYMBOLS.length})...`);
    const data = await fetchStock(symbol);
    if (data) {
      fs.writeFileSync(outPath, JSON.stringify(data));
      console.log(`Saved ${symbol}`);
      fetched++;
    }
    // Alpha Vantage free API: 5 requests per minute
    if (fetched < 25 && i < SYMBOLS.length - 1) await new Promise(r => setTimeout(r, 13000));
    if (fetched >= 25) {
      console.log('API daily limit reached (25 new stocks). Stopping.');
      break;
    }
  }
  console.log(`Done! Fetched ${fetched} new stocks.`);
})();
