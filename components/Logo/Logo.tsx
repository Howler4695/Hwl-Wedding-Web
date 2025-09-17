import React from "react";

/**
 * Magnolia Wedding Logo — inline SVG wordmark
 * Palette: ivory (#FFFAF2), leaf green (#2E4E3F), soft gold (#CAA55A/#B28B3F)
 *
 * Usage:
 *   import { LogoFull, LogoBadge } from "@/components/Logo";
 *   <LogoFull names="Hannah & Hayden" tagline="Wedding" />
 *   <LogoBadge names="Hannah & Hayden" tagline="Wedding" />
 */

export type LogoProps = {
  names?: string;
  tagline?: string;
  className?: string;
  colors?: {
    ivory?: string;
    green?: string;
    goldA?: string; // highlight
    goldB?: string; // base
    stroke?: string;
  };
};

const DEFAULT_COLORS = {
  ivory: "#FFFAF2",
  green: "#2E4E3F",
  goldA: "#EED593",
  goldB: "#CAA55A",
  stroke: "#D8CCB3",
};

export function LogoFull({
  names = "Hannah & Hayden",
  tagline = "Wedding",
  className = "",
  colors = DEFAULT_COLORS,
}: LogoProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const width = 960; // wide horizontal for headers
  const height = 240;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${names} ${tagline} logo`}
    >
      {/* Wordmark (right) */}
      <g transform="translate(200,0)">
        <text
          x="0"
          y="120"
          fill={c.green}
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="72"
          fontWeight={600}
          letterSpacing="0.02em"
        >
          {names}
        </text>
        {/* thin gold rule */}
        <rect
          x="2"
          y="136"
          width="520"
          height="2"
          fill="url(#goldGrad)"
          rx="1"
        />
        <text
          x="0"
          y="188"
          fill="#6B725E"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="28"
          letterSpacing="0.35em"
          style={{ textTransform: "uppercase" }}
        >
          {tagline}
        </text>
      </g>
    </svg>
  );
}

export function LogoBadge({
  names = "Hannah & Hayden",
  tagline = "Wedding",
  className = "",
  colors = DEFAULT_COLORS,
}: LogoProps) {
  const c = { ...DEFAULT_COLORS, ...colors };
  const width = 420; // stacked badge for mobile / footer
  const height = 420;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${names} ${tagline} logo badge`}
    >
      <defs>
        <linearGradient id="goldGradB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.goldA} />
          <stop offset="100%" stopColor={c.goldB} />
        </linearGradient>
        <radialGradient id="petalGradB" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor={c.ivory} />
          <stop offset="60%" stopColor="#F3E9D6" />
          <stop offset="100%" stopColor="#E6D9C1" />
        </radialGradient>
        <linearGradient id="leafGradB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B6C5A" />
          <stop offset="100%" stopColor={c.green} />
        </linearGradient>
      </defs>

      {/* outer ring */}
      <circle
        cx="210"
        cy="120"
        r="70"
        fill="none"
        stroke="url(#goldGradB)"
        strokeWidth="6"
      />

      {/* emblem */}
      <g transform="translate(210,120)">
        <ellipse
          rx="18"
          ry="44"
          fill="url(#leafGradB)"
          transform="rotate(-26) translate(0,-10)"
          opacity="0.95"
        />
        <ellipse
          rx="16"
          ry="40"
          fill="url(#leafGradB)"
          transform="rotate(28) translate(0,-10)"
          opacity="0.9"
        />
        <Petal rotate={0} gradId="petalGradB" />
        <Petal rotate={60} gradId="petalGradB" />
        <Petal rotate={120} gradId="petalGradB" />
        <Petal rotate={180} gradId="petalGradB" />
        <Petal rotate={240} gradId="petalGradB" />
        <Petal rotate={300} gradId="petalGradB" />
        <circle
          r="12"
          fill="url(#goldGradB)"
          stroke="#B28B3F"
          strokeWidth="1.5"
        />
      </g>

      {/* text */}
      <text
        x="210"
        y="250"
        textAnchor="middle"
        fill={c.green}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="40"
        fontWeight={600}
      >
        {names}
      </text>
      <rect
        x="110"
        y="264"
        width="200"
        height="2"
        fill="url(#goldGradB)"
        rx="1"
      />
      <text
        x="210"
        y="310"
        textAnchor="middle"
        fill="#6B725E"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="18"
        letterSpacing="0.35em"
        style={{ textTransform: "uppercase" }}
      >
        {tagline}
      </text>
    </svg>
  );
}

function Petal({
  rotate = 0,
  gradId = "petalGrad",
}: {
  rotate?: number;
  gradId?: string;
}) {
  return (
    <g transform={`rotate(${rotate})`}>
      <path
        d="M0,-62 C-18,-46 -28,-26 -28,-8 C-28,10 -16,22 0,26 C16,22 28,10 28,-8 C28,-26 18,-46 0,-62 Z"
        fill={`url(#${gradId})`}
        stroke="#D8CCB3"
        strokeWidth="1"
      />
    </g>
  );
}
