import React from 'react';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export default function Logo({ width = 32, height = 32, className }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      width={width} 
      height={height} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ borderRadius: '25%' }}
    >
      <rect width="100" height="100" fill="url(#bgGrad)" />
      
      {/* Main spine of the B */}
      <path d="M 25 15 L 25 85" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
      
      {/* Top loop */}
      <path d="M 25 15 L 55 15 C 75 15 75 45 55 45 L 25 45" stroke="#06b6d4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Bottom loop */}
      <path d="M 25 45 L 60 45 C 85 45 85 85 60 85 L 25 85" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Cyberpunk/Network Nodes */}
      <circle cx="25" cy="15" r="8" fill="#3b82f6" />
      <circle cx="25" cy="85" r="8" fill="#3b82f6" />
      <circle cx="55" cy="15" r="6" fill="#06b6d4" />
      <circle cx="70" cy="30" r="6" fill="#06b6d4" />
      <circle cx="75" cy="65" r="6" fill="#8b5cf6" />
      <circle cx="60" cy="85" r="6" fill="#8b5cf6" />
      <circle cx="25" cy="45" r="6" fill="#ffffff" />
      
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
