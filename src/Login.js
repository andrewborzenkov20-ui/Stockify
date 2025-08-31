import React, { useRef, useState } from 'react';
import { useAuth } from './AuthProvider';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(emailRef.current.value, passwordRef.current.value);
    } catch {
      setError("Failed to log in");
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0057B8 0%, #FFD600 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        padding: '2.5rem 2rem',
        minWidth: 320,
        maxWidth: 360,
        width: '100%',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#0057B8', fontWeight: 700, marginBottom: 24 }}>Log In</h2>
        {error && <div style={{color:'#d32f2f', marginBottom: 16, fontWeight: 500}}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input type="email" ref={emailRef} placeholder="Email" required style={{
            padding: '0.75rem',
            borderRadius: 8,
            border: '1px solid #bbb',
            fontSize: '1rem',
            marginBottom: 8
          }} />
          <input type="password" ref={passwordRef} placeholder="Password" required style={{
            padding: '0.75rem',
            borderRadius: 8,
            border: '1px solid #bbb',
            fontSize: '1rem',
            marginBottom: 8
          }} />
          <button disabled={loading} type="submit" style={{
            background: '#0057B8',
            color: '#FFD600',
            fontWeight: 700,
            padding: '0.75rem',
            borderRadius: 8,
            border: 'none',
            fontSize: '1.1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: 8
          }}>Log In</button>
        </form>
      </div>
    </div>
  );
}
