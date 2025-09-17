import React from "react";

export default function GoldFrame({
  children,
  className = "",
  radius = 28, // corner radius in px
  pad = 10, // inner padding (px) you want *inside* the card
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  pad?: number;
}) {
  return (
    <div
      className={[
        "relative rounded-[28px] p-[2px]",
        // soft gold foil gradient ring (conic gives that subtle shimmer feel)
        "bg-[conic-gradient(at_50%_50%,#FFF6D8_0deg,#CAA55A_90deg,#B28B3F_180deg,#CAA55A_270deg,#FFF6D8_360deg)]",
        "shadow-xl",
        className,
      ].join(" ")}
      style={{ borderRadius: radius }}
    >
      {/* Inner card */}
      <div
        className="relative rounded-[26px] border border-[#E8DDC9] bg-white/70 backdrop-blur-xl"
        style={{ borderRadius: radius - 2, padding: pad }}
      >
        {/* Decorative SVG outline on top for fine detail */}
        <svg
          className="pointer-events-none absolute inset-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF6D8" />
              <stop offset="45%" stopColor="#CAA55A" />
              <stop offset="100%" stopColor="#B28B3F" />
            </linearGradient>
          </defs>

          {/* main fine outline */}
          <rect
            x="1.3"
            y="1.3"
            width="97.4"
            height="97.4"
            rx="14"
            ry="14"
            fill="none"
            stroke="url(#goldStroke)"
            strokeWidth="0.9"
          />

          {/* inner hairline + corner ticks for “fancy” detail */}
          <rect
            x="3.2"
            y="3.2"
            width="93.6"
            height="93.6"
            rx="12.5"
            ry="12.5"
            fill="none"
            stroke="#E6D7BD"
            strokeOpacity="0.65"
            strokeWidth="0.5"
          />

          {/* corner ornaments (draw once, mirror thrice) */}
          <g stroke="#CAA55A" strokeWidth="0.7" fill="none" opacity="0.9">
            {/* top-left */}
            <path d="M6 22 Q6 6 22 6" />
            <path d="M10 18 Q10 10 18 10" stroke="#B28B3F" strokeWidth="0.5" />
            <circle cx="13" cy="13" r="0.9" fill="#CAA55A" />
            {/* top-right */}
            <g transform="translate(100,0) scale(-1,1)">
              <path d="M6 22 Q6 6 22 6" />
              <path
                d="M10 18 Q10 10 18 10"
                stroke="#B28B3F"
                strokeWidth="0.5"
              />
              <circle cx="13" cy="13" r="0.9" fill="#CAA55A" />
            </g>
            {/* bottom-left */}
            <g transform="translate(0,100) scale(1,-1)">
              <path d="M6 22 Q6 6 22 6" />
              <path
                d="M10 18 Q10 10 18 10"
                stroke="#B28B3F"
                strokeWidth="0.5"
              />
              <circle cx="13" cy="13" r="0.9" fill="#CAA55A" />
            </g>
            {/* bottom-right */}
            <g transform="translate(100,100) scale(-1,-1)">
              <path d="M6 22 Q6 6 22 6" />
              <path
                d="M10 18 Q10 10 18 10"
                stroke="#B28B3F"
                strokeWidth="0.5"
              />
              <circle cx="13" cy="13" r="0.9" fill="#CAA55A" />
            </g>
          </g>
        </svg>

        {children}
      </div>
    </div>
  );
}
