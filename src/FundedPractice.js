import React, { useState, useEffect } from "react";
import StockChart from "./StockChart";
import { useAuth } from "./AuthProvider";
import CoinIcon from "./CoinIcon";

const START_BALANCE = 50000;
const PROFIT_TARGET = 2500;
const MAX_DRAWDOWN = -2500;
const STOCKS = ["AAPL", "MSFT", "GOOG", "AMZN", "META", "TSLA", "NVDA"];

export default function FundedPractice() {
  const [symbol, setSymbol] = useState(STOCKS[0]);
  const [balance, setBalance] = useState(START_BALANCE);
  const [position, setPosition] = useState(0); // shares
  const [entryPrice, setEntryPrice] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");
  const [buyAmount, setBuyAmount] = useState(1000); // dollars
  const [chartPrices, setChartPrices] = useState([]);
  const [currentBar, setCurrentBar] = useState(0); // index in chartPrices
  const { currentUser } = useAuth();

  // Get price for current bar
  const price = chartPrices[currentBar] || 100;
  const openPnl = position > 0 ? (price - entryPrice) * position : 0;

  // Simulate price feed: move forward in time
  function nextBar() {
    if (currentBar < chartPrices.length - 1) setCurrentBar(b => b + 1);
  }

  function handleBuy() {
    if (position !== 0) return setStatus("Close your current position first.");
    if (buyAmount > balance) return setStatus("Not enough balance.");
    const shares = Math.floor(buyAmount / price);
    if (shares < 1) return setStatus("Buy amount too small.");
    setPosition(shares);
    setEntryPrice(price);
    setBalance(bal => bal - shares * price);
    setStatus(`Bought ${shares} shares @ $${price.toFixed(2)}`);
  }

  function handleSell() {
    if (position === 0) {
      setStatus("You can't sell stocks you don't own. Open a position first.");
      return;
    }
    const profit = (price - entryPrice) * position;
    setBalance(bal => bal + position * price + profit);
    setHistory(h => [...h, { entry: entryPrice, exit: price, shares: position, profit }]);
    setPosition(0);
    setEntryPrice(null);
    setStatus(`Closed position. P&L: $${profit.toFixed(2)}`);
  }

  // Challenge logic
  const totalProfit = balance - START_BALANCE + openPnl;
  const drawdown = Math.min(0, ...history.map(trade => trade.profit));
  let challengeMsg = "";
  if (totalProfit >= PROFIT_TARGET) challengeMsg = "Challenge Passed!";
  else if (totalProfit <= MAX_DRAWDOWN) challengeMsg = "Challenge Failed (Max Drawdown).";

  // Load chart prices from StockChart
  function onChartData(prices) {
    setChartPrices(prices);
    setCurrentBar(0);
  }

  useEffect(() => {
    setPosition(0);
    setEntryPrice(null);
    setHistory([]);
    setBalance(START_BALANCE);
    setStatus("");
    setChartPrices([]);
    setCurrentBar(0);
  }, [symbol]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0057B8 0%, #FFD600 100%)', padding: 0 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: 24, marginTop: 32 }}>
        <h1 style={{ color: '#0057B8', fontWeight: 700 }}>Funded Trader Practice</h1>
        <div style={{ marginBottom: 16 }}>
          <label>Stock: </label>
          <select value={symbol} onChange={e => setSymbol(e.target.value)}>
            {STOCKS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <StockChart symbol={symbol} cutoff={60} reveal={true} onReveal={onChartData} />
        <div style={{ margin: '16px 0', fontWeight: 600 }}>
          Balance: ${balance.toFixed(2)} | Position: {position} shares {position !== 0 && `(Entry $${entryPrice})`}<br />
          {position > 0 && <span style={{ color: openPnl >= 0 ? '#388e3c' : '#d32f2f' }}>Open P&L: ${openPnl.toFixed(2)}</span>}
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
          <input type="number" min={1} step={100} value={buyAmount} onChange={e => setBuyAmount(Number(e.target.value))} style={{ width: 100, padding: 6, borderRadius: 6, border: '1px solid #bbb' }} />
          <span style={{ fontWeight: 500 }}>Buy $</span>
          <button onClick={handleBuy} style={{ background: '#0057B8', color: '#FFD600', fontWeight: 700, padding: '0.5rem 1.5rem', borderRadius: 8, border: 'none', fontSize: '1rem', cursor: 'pointer' }}>Buy</button>
          <button onClick={handleSell} style={{ background: '#FFD600', color: '#0057B8', fontWeight: 700, padding: '0.5rem 1.5rem', borderRadius: 8, border: 'none', fontSize: '1rem', cursor: 'pointer' }}>Sell</button>
          <button onClick={nextBar} style={{ marginLeft: 12, background: '#eee', color: '#0057B8', fontWeight: 700, padding: '0.5rem 1.5rem', borderRadius: 8, border: 'none', fontSize: '1rem', cursor: 'pointer' }}>Next Day</button>
        </div>
        {status && <div style={{ marginBottom: 8, color: '#0057B8' }}>{status}</div>}
        <div style={{ margin: '12px 0', color: '#388e3c', fontWeight: 700 }}>{challengeMsg}</div>
        <div style={{ marginTop: 16 }}>
          <h3>Trade History</h3>
          <ul style={{ maxHeight: 120, overflowY: 'auto', fontSize: '0.95rem' }}>
            {history.map((t, i) => (
              <li key={i}>Entry: ${t.entry} → Exit: ${t.exit} | Shares: {t.shares} | P&L: ${t.profit.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
