export default function MagnoliaCorner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id="petal" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFFAF2" />
          <stop offset="60%" stopColor="#F7EFE2" />
          <stop offset="100%" stopColor="#EDE2CD" />
        </radialGradient>
        <linearGradient id="leaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3E5F4D" />
          <stop offset="100%" stopColor="#2E4E3F" />
        </linearGradient>
      </defs>

      {/* Leaves */}
      <ellipse
        cx="42"
        cy="152"
        rx="16"
        ry="36"
        fill="url(#leaf)"
        transform="rotate(-20 42 152)"
        opacity="0.85"
      />
      <ellipse
        cx="162"
        cy="38"
        rx="16"
        ry="36"
        fill="url(#leaf)"
        transform="rotate(-15 162 38)"
        opacity="0.85"
      />

      {/* Magnolia bloom */}
      <g transform="translate(100,100)">
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(0)" />
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(60)" />
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(120)" />
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(180)" />
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(240)" />
        <ellipse rx="22" ry="54" fill="url(#petal)" transform="rotate(300)" />
        <circle r="12" fill="#CAA55A" stroke="#B28B3F" strokeWidth="1.25" />
      </g>

      {/* Gold speckles */}
      <g opacity="0.28">
        <circle cx="18" cy="182" r="2" fill="#CAA55A" />
        <circle cx="30" cy="166" r="1.5" fill="#CAA55A" />
        <circle cx="174" cy="18" r="2" fill="#CAA55A" />
        <circle cx="160" cy="34" r="1.5" fill="#CAA55A" />
      </g>
    </svg>
  );
}
