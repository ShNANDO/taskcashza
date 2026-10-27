import React from 'react';

interface NetflixPayLogoProps {
  className?: string;
  showHubBadge?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function NetflixPayLogo({
  className = 'w-64 max-w-full h-auto',
  showHubBadge = false,
}: NetflixPayLogoProps) {
  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* High-fidelity Vector SVG reproducing the Netflix Pay Red Swoosh Logo */}
      <svg
        viewBox="0 0 540 160"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_4px_16px_rgba(229,9,20,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Netflix Red Linear Gradient */}
          <linearGradient id="netflixRedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E50914" />
            <stop offset="50%" stopColor="#E50914" />
            <stop offset="100%" stopColor="#B80710" />
          </linearGradient>

          {/* Pay White Gradient with Subtle Dimensional Depth */}
          <linearGradient id="payWhiteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Arc Clipping Mask for authentic Netflix arched baseline */}
          <clipPath id="netflixBottomArcClip">
            <path d="M 0 0 L 360 0 L 360 136 Q 180 119 0 136 Z" />
          </clipPath>

          {/* Subtle Outer Glow */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* --- NETFLIX SECTION (with arched baseline) --- */}
        <g clipPath="url(#netflixBottomArcClip)">
          {/* Main NETFLIX Letters */}
          <text
            x="5"
            y="126"
            fill="url(#netflixRedGradient)"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
              fontSize: '112px',
              fontWeight: 900,
              letterSpacing: '1px',
            }}
          >
            NETFLIX
          </text>
        </g>

        {/* --- RED ACCENT BETWEEN X AND P --- */}
        {/* Curved dynamic red slash between X and P as seen in the official logo */}
        <path
          d="M 334 102 C 344 96 358 92 368 91 C 358 98 346 106 334 102 Z"
          fill="#E50914"
        />

        {/* --- PAY SECTION --- */}
        <g filter="url(#softGlow)">
          <text
            x="352"
            y="125"
            fill="url(#payWhiteGradient)"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
              fontSize: '112px',
              fontWeight: 900,
              letterSpacing: '2px',
            }}
          >
            PAY
          </text>
        </g>

        {/* --- DYNAMIC RED SWOOSH UNDER 'PAY' --- */}
        {/* Sweeps gracefully under PAY and swooshes up to the right */}
        <path
          d="M 370 142 C 430 144 492 135 528 100 C 525 111 482 147 370 142 Z"
          fill="#E50914"
        />
        {/* Subtle swoosh highlight tip */}
        <path
          d="M 460 138 C 500 132 524 112 528 100 C 526 106 502 126 460 138 Z"
          fill="#FF2A36"
          opacity="0.8"
        />

        {/* Optional integrated HUB badge inside SVG */}
        {showHubBadge && (
          <g transform="translate(470, 24)">
            <rect
              x="0"
              y="0"
              width="62"
              height="26"
              rx="6"
              fill="#E50914"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <text
              x="31"
              y="18"
              textAnchor="middle"
              fill="#FFFFFF"
              style={{
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 900,
                letterSpacing: '1.5px',
              }}
            >
              HUB
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
