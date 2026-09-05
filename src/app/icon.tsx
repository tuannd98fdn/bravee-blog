import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        }}
      >
        <svg viewBox="0 0 100 100" width="75%" height="75%" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
