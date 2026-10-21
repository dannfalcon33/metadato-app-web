import React, { useState, useEffect } from 'react';
import { Disc3 } from 'lucide-react';

interface CoverArtVisualProps {
  src?: string;
  alt: string;
  title?: string;
  artist?: string;
  className?: string;
}

export const CoverArtVisual: React.FC<CoverArtVisualProps> = ({
  src,
  alt,
  title,
  artist,
  className = 'w-full h-full',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#0B0F17] select-none ${className}`}
        aria-label={alt}
      >
        <svg
          viewBox="0 0 240 240"
          className="absolute inset-0 w-full h-full opacity-35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="120" cy="120" r="104" stroke="var(--neon-primary)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="120" cy="120" r="82" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <circle cx="120" cy="120" r="60" stroke="var(--neon-primary)" strokeWidth="0.75" strokeOpacity="0.5" />
          <circle cx="120" cy="120" r="38" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <circle cx="120" cy="120" r="14" fill="var(--neon-muted)" stroke="var(--neon-primary)" strokeWidth="1.5" />
        </svg>
        <div className="relative z-10 flex flex-col items-center text-center px-3">
          <Disc3 className="w-8 h-8 neon-text mb-2 opacity-90" />
          {title && (
            <span className="text-xs font-semibold text-slate-200 line-clamp-1 max-w-[160px]">
              {title}
            </span>
          )}
          {artist && (
            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[140px] mt-0.5">
              {artist}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
    />
  );
};
