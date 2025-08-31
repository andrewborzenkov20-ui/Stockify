import React from 'react';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0057B8 0%, #FFD600 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        padding: '3rem 2.5rem',
        maxWidth: 480,
        width: '90%',
        textAlign: 'center',
        margin: '2rem 0'
      }}>
  <img src="/logo.png" alt="Stock Royale Logo" style={{ width: 120, marginBottom: 24 }} />
        <h1 style={{ color: '#0057B8', fontWeight: 800, fontSize: '2.5rem', marginBottom: 16 }}>Welcome to Stock Royale!</h1>
        <p style={{ color: '#222', fontSize: '1.2rem', marginBottom: 32 }}>
          Play, learn, and compete in the ultimate stock trading game.<br />
          Challenge friends, test your skills, and master the market!
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <a href="/1v1" style={{
            background: '#0057B8',
            color: '#FFD600',
            fontWeight: 700,
            padding: '0.75rem 2rem',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: '1.1rem',
            transition: 'background 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>Play 1v1</a>
          <a href="/learn" style={{
            background: '#FFD600',
            color: '#0057B8',
            fontWeight: 700,
            padding: '0.75rem 2rem',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: '1.1rem',
            transition: 'background 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>Learn</a>
        </div>
      </div>
    </div>
  );
}
