import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const API_KEY = "H49EVTIFUV22L895";


// Show 120 days before cutoff, and 30 days after
const DEFAULT_CUTOFF = 120;
const DEFAULT_AFTER = 30;

export default function StockChart({ symbol = "AAPL", cutoff = DEFAULT_CUTOFF, after = DEFAULT_AFTER, reveal = false, onReveal }) {
  const [labels, setLabels] = useState([]);
  const [prices, setPrices] = useState([]);
  // Only used for previous candle feature, can be removed if not needed
  // const [ohlc, setOhlc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState("line");
  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState([]); // [{x1, y1, x2, y2}]
  const [currentLine, setCurrentLine] = useState(null); // {x1, y1, x2, y2}
  const chartRef = useRef();
  const svgRef = useRef();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        // Load from public/stock-data/SYMBOL.json
        const url = `/stock-data/${symbol.replace('.', '_')}.json`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data["Time Series (Daily)"]) {
          setError("No local data found for this symbol.");
          setLoading(false);
          return;
        }
        const localDates = Object.keys(data["Time Series (Daily)"]).sort();
        let closePrices = localDates.map(date => parseFloat(data["Time Series (Daily)"][date]["4. close"]));
  setLabels(localDates);
  setPrices(closePrices);
      } catch (e) {
        setError("Failed to load local data.");
      }
      setLoading(false);
    }
    fetchData();
  }, [symbol]);

  useEffect(() => {
    if (reveal && prices.length > 0 && typeof onReveal === 'function') {
      onReveal(prices);
    }
  }, [reveal, prices, onReveal]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Show only part of the chart if not revealed
  const chartLabels = reveal
    ? labels.slice(0, cutoff + after)
    : labels.slice(0, cutoff);
  const chartPrices = reveal
    ? prices.slice(0, cutoff + after)
    : prices.slice(0, cutoff);
  //

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <button onClick={() => setChartType('line')} style={{ background: chartType === 'line' ? '#0057B8' : '#eee', color: chartType === 'line' ? '#FFD600' : '#0057B8', fontWeight: 700, border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }}>Line</button>
        <button onClick={() => setChartType('candle')} style={{ background: chartType === 'candle' ? '#0057B8' : '#eee', color: chartType === 'candle' ? '#FFD600' : '#0057B8', fontWeight: 700, border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }}>Candles</button>
        <button onClick={() => setDrawing(d => !d)} style={{ background: drawing ? '#FFD600' : '#eee', color: drawing ? '#0057B8' : '#0057B8', fontWeight: 700, border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }}>Draw Line</button>
      </div>
      {/* Chart with drawing overlay (basic) */}
      <div style={{ position: 'relative', minHeight: 400 }}>
        <Line
          data={{
            labels: chartLabels,
            datasets: [
              {
                label: `${symbol} Close Price`,
                data: chartPrices,
                borderColor: "#0057B8",
                backgroundColor: "rgba(0,87,184,0.1)",
                tension: 0.2,
                pointRadius: 0,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: `${symbol} Stock Chart` },
            },
            scales: {
              x: { display: true },
              y: { display: true },
            },
          }}
        />
        {/* Drawing lines overlay (SVG for simplicity) - can be adapted for new chart if needed */}
        <svg
          ref={svgRef}
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: drawing ? 'auto' : 'none', width: '100%', height: '100%' }}
          width="100%"
          height="100%"
          onMouseDown={e => {
            if (!drawing) return;
            const rect = svgRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setCurrentLine({ x1: x, y1: y, x2: x, y2: y });
          }}
          onMouseMove={e => {
            if (!drawing || !currentLine) return;
            const rect = svgRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setCurrentLine(line => line ? { ...line, x2: x, y2: y } : null);
          }}
          onMouseUp={e => {
            if (!drawing || !currentLine) return;
            setLines(lines => [...lines, currentLine]);
            setCurrentLine(null);
          }}
        >
          {lines.map((line, i) => (
            <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#d32f2f" strokeWidth={2} />
          ))}
          {currentLine && (
            <line x1={currentLine.x1} y1={currentLine.y1} x2={currentLine.x2} y2={currentLine.y2} stroke="#FFD600" strokeWidth={2} strokeDasharray="4" />
          )}
        </svg>
      </div>
    </div>
  );
}
