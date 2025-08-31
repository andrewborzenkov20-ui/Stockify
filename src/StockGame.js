import React, { useState, useEffect } from "react";
import StockChart from "./StockChart";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import CoinIcon from "./CoinIcon";


// 25 most recently fetched stocks
const STOCK_SYMBOLS = [
  "AAPL", "MSFT", "GOOG", "AMZN", "META", "TSLA", "NVDA", "BRK.B", "JPM", "V",
  "UNH", "HD", "PG", "MA", "LLY", "XOM", "MRK", "AVGO", "COST", "ABBV",
  "PEP", "KO", "ADBE", "WMT", "BAC"
];

function getRandomStock() {
  return STOCK_SYMBOLS[Math.floor(Math.random() * STOCK_SYMBOLS.length)];
}

function StockGame() {
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState("");
  const [symbol, setSymbol] = useState(getRandomStock());
  const [score, setScore] = useState(0);
  const [lastDirection, setLastDirection] = useState(null);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [coins, setCoins] = useState(0);
  const [challenge, setChallenge] = useState({ streak: 0, minScore: 0, completed: false });
  const [challengeMsg, setChallengeMsg] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Load coins and challenge state from Firestore
  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setCoins(data.coins || 0);
        setChallenge(data.challenge || { streak: 0, minScore: 0, completed: false });
      }
    };
    fetchData();
  }, [currentUser]);

  // Save coins and challenge state to Firestore
  useEffect(() => {
    if (!currentUser) return;
    const saveData = async () => {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { coins, challenge }, { merge: true });
    };
    saveData();
  }, [coins, challenge, currentUser]);

  // Helper to determine if the stock went up or down after cutoff
  function getOutcome(prices) {
    if (!prices || prices.length < 61) return null;
    // Compare the price at cutoff (index 59) to the price 10 days after cutoff, or last available
    const before = prices[59];
    const after = prices[Math.min(prices.length - 1, 69)];
    if (after > before) return "up";
    if (after < before) return "down";
    return "same";
  }

  function handleGuess(direction) {
    setRevealed(true);
    setLastDirection(direction);
  }

  function onChartReveal(prices) {
    if (!lastDirection) return;
    const outcome = getOutcome(prices);
    let correct = false;
    let newScore = score;
    let newStreak = challenge.streak;
    let newMinScore = challenge.minScore;
    let completed = challenge.completed;
    if (outcome === lastDirection) {
      newScore = score + 1;
      setScore(newScore);
      setResult("Correct! You predicted " + lastDirection.toUpperCase() + ".");
      correct = true;
      newStreak = challenge.streak + 1;
    } else if (outcome === "same") {
      setResult("No change after cutoff. No score.");
    } else {
      newScore = score - 1;
      setScore(newScore);
      setResult("Wrong! You predicted " + lastDirection.toUpperCase() + ".");
      newStreak = 0;
    }
    setLastCorrect(correct);
    // Track minScore for challenge
    newMinScore = Math.min(newMinScore, newScore);
    // Challenge logic: 5 in a row or don't go below -5
    let msg = "";
    if (!completed && newStreak >= 5) {
      completed = true;
      setCoins(c => c + 5);
      msg = "Challenge complete! 5 in a row. +5 coins!";
    } else if (!completed && newMinScore > -5 && newScore >= 10) {
      completed = true;
      setCoins(c => c + 5);
      msg = "Challenge complete! Never went below -5. +5 coins!";
    }
    setChallenge({ streak: newStreak, minScore: newMinScore, completed });
    setChallengeMsg(msg);
  }

  function nextRound() {
    setSymbol(getRandomStock());
    setRevealed(false);
    setResult("");
    setLastDirection(null);
    setLastCorrect(null);
    setChallengeMsg("");
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0057B8 0%, #FFD600 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Top Navigation Bar */}
      <div
        style={{
          width: '100%',
          background: '#FFD600',
          padding: '16px 0',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
        }}
      >
        <span style={{ color: '#0057B8', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
        <span style={{ color: '#0057B8', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => navigate('/1v1')}>1v1</span>
        <span style={{ color: '#0057B8', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>Friends</span>
        <span style={{ color: '#0057B8', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>Learn</span>
        {/* Coin icon and count */}
        <span style={{ display: 'flex', alignItems: 'center', marginLeft: 16 }}>
          <CoinIcon size={28} style={{ marginRight: 6 }} />
          <span style={{ color: '#B8860B', fontWeight: 700, fontSize: '1.1rem' }}>{coins}</span>
        </span>
      </div>
      <div style={{ height: '64px' }} /> {/* Spacer for fixed bar */}
      <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', marginTop: 32, background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ maxWidth: 120, marginBottom: 16 }} />
        <h1 style={{ color: '#0057B8', fontSize: '2rem', fontWeight: 700, marginBottom: 12 }}>Stock Guessing Game</h1>
        <div style={{ width: '100%', marginBottom: 24 }}>
          <StockChart symbol={symbol} cutoff={60} reveal={revealed} onReveal={revealed ? onChartReveal : undefined} />
        </div>
        <div style={{ color: '#0057B8', fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>Score: {score}</div>
        {/* Daily Challenge UI */}
        <div style={{ background: '#FFD600', color: '#0057B8', borderRadius: 8, padding: '8px 16px', fontWeight: 600, marginBottom: 12 }}>
          Daily Challenge: Get 5 in a row or never go below -5 (reach 10)
          <br />
          Streak: {challenge.streak} | Min Score: {challenge.minScore}
          {challenge.completed && <span style={{ color: '#388e3c', marginLeft: 8 }}>✓ Completed</span>}
        </div>
        {challengeMsg && <div style={{ color: '#388e3c', fontWeight: 700, marginBottom: 8 }}>{challengeMsg}</div>}
        {!revealed && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <button onClick={() => handleGuess('up')} style={{ background: '#0057B8', color: '#FFD600', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: 8, border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}>Guess Up</button>
            <button onClick={() => handleGuess('down')} style={{ background: '#FFD600', color: '#0057B8', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: 8, border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}>Guess Down</button>
          </div>
        )}
        {result && <div style={{ color: '#0057B8', fontWeight: 600, marginTop: 8 }}>{result}</div>}
        {revealed && (
          <button onClick={nextRound} style={{ marginTop: 20, background: '#0057B8', color: '#FFD600', fontWeight: 700, padding: '0.75rem 2rem', borderRadius: 8, border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}>
            Next Stock
          </button>
        )}
      </div>
    </div>
  );
}
export default StockGame;
