import React from 'react';

export default function CoinIcon({ size = 24, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#FFD600" stroke="#B8860B" strokeWidth="2" />
      <text x="16" y="21" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#B8860B" fontFamily="Arial">$</text>
    </svg>
  );
}
