import React from "react";

function LearnPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Learn Stock Trading</h1>
      <ul style={{ textAlign: "left", maxWidth: 600, margin: "2rem auto", fontSize: "1.1rem" }}>
        <li><b>Start with Education:</b> Learn the basics of stocks, markets, and trading strategies before investing real money.</li>
        <li><b>Diversify:</b> Don’t put all your money in one stock. Spread your investments to reduce risk.</li>
        <li><b>Have a Plan:</b> Set clear goals, know your risk tolerance, and stick to your strategy.</li>
        <li><b>Invest for the Long Term:</b> Trying to “time the market” is risky. Long-term investing usually wins.</li>
        <li><b>Control Emotions:</b> Don’t let fear or greed drive your decisions. Stay disciplined.</li>
        <li><b>Research Companies:</b> Understand what you’re buying—look at financials, news, and trends.</li>
        <li><b>Use Stop-Losses:</b> Protect yourself from big losses by setting automatic sell points.</li>
        <li><b>Keep Learning:</b> The market changes—keep reading and improving your knowledge.</li>
      </ul>
      <p style={{ color: "#888" }}>This is just a starting point. Always do your own research before investing!</p>
    </div>
  );
}

export default LearnPage;