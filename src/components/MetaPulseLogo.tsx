import React from 'react';

interface MetaPulseLogoProps {
  className?: string;
}

export const MetaPulseLogo: React.FC<MetaPulseLogoProps> = ({
  className = 'w-8 h-8',
}) => {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Octagonal Cyberpunk Chassis reactive to active --neon-primary */}
      <polygon
        points="36,8 92,8 120,36 120,92 92,120 36,120 8,92 8,36"
        fill="#0B1018"
        stroke="var(--neon-primary)"
        strokeWidth="5"
      />

      {/* Inner Vinyl Acoustic Rings */}
      <circle
        cx="64"
        cy="64"
        r="41"
        stroke="var(--neon-primary)"
        strokeWidth="2"
        strokeDasharray="6 5"
        strokeOpacity="0.6"
      />
      <circle
        cx="64"
        cy="64"
        r="28"
        stroke="#F1F5F9"
        strokeWidth="1.25"
        strokeOpacity="0.2"
      />

      {/* Pulse Waveform "M" Monogram */}
      <path
        d="M22 66 H35 L44 40 L54 86 L64 30 L74 86 L84 40 L93 66 H106"
        stroke="var(--neon-primary)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Core Node */}
      <circle cx="64" cy="64" r="5" fill="#F1F5F9" />
    </svg>
  );
};
