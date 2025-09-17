import { JSX, useId, useMemo } from "react";

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

// Save as components/Magnolia.tsx
// A more detailed southern magnolia SVG, matching the ivory/leaf green/soft gold palette.
// Usage examples:
//  <MagnoliaCornerDetailed className="absolute -top-20 -left-24 h-80 w-80 opacity-80" />
//  <MagnoliaCornerDetailed className="absolute -bottom-24 -right-24 h-96 w-96 rotate-180 opacity-80" />
//  <MagnoliaBadgeDetailed className="mx-auto h-40 w-40" />

export function MagnoliaCornerDetailed({
  className = "",
  ariaLabel = "Decorative magnolia",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const uid = useId().replace(/[:]/g, "");
  const ids = {
    petal: `petal-${uid}`,
    petalShadow: `petalShadow-${uid}`,
    leafTop: `leafTop-${uid}`,
    leafUnd: `leafUnd-${uid}`,
    cone: `cone-${uid}`,
    stamen: `stamen-${uid}`,
    gloss: `gloss-${uid}`,
  } as const;

  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* Petal gradients: creamy ivory with soft depth */}
        <radialGradient id={ids.petal} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#FFFAF2" />
          <stop offset="55%" stopColor="#F7EFE2" />
          <stop offset="100%" stopColor="#EDE2CD" />
        </radialGradient>
        <linearGradient id={ids.petalShadow} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>

        {/* Leaf (top side) deep glossy green */}
        <linearGradient id={ids.leafTop} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#476A58" />
          <stop offset="100%" stopColor="#2E4E3F" />
        </linearGradient>
        {/* Leaf underside (rusty brown) */}
        <linearGradient id={ids.leafUnd} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B88A59" />
          <stop offset="100%" stopColor="#8B5A2B" />
        </linearGradient>

        {/* Cone / center (soft gold) */}
        <linearGradient id={ids.cone} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8C980" />
          <stop offset="100%" stopColor="#CAA55A" />
        </linearGradient>
        <radialGradient id={ids.stamen} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#F1D587" />
          <stop offset="100%" stopColor="#B28B3F" />
        </radialGradient>

        {/* Soft specular gloss for petals */}
        <linearGradient id={ids.gloss} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background flair speckles (soft gold) */}
      <g opacity="0.25">
        <circle cx="28" cy="484" r="3" fill="#CAA55A" />
        <circle cx="60" cy="456" r="2" fill="#CAA55A" />
        <circle cx="484" cy="28" r="3" fill="#CAA55A" />
        <circle cx="452" cy="54" r="2" fill="#CAA55A" />
      </g>

      {/* Corner leaves (top + underside peeking) */}
      <g transform="translate(24, 340) rotate(-18)">
        {/* underside shadow */}
        <path
          d="M0,40 C40,0 120,-10 170,20 C210,44 220,78 206,106 C168,96 120,92 84,102 C56,110 24,112 0,100 Z"
          fill={`url(#${ids.leafUnd})`}
          opacity="0.9"
        />
        {/* top face */}
        <path
          d="M0,40 C44,-6 128,-14 184,14 C230,36 246,84 212,122 C168,106 126,110 84,122 C48,132 18,130 0,112 Z"
          fill={`url(#${ids.leafTop})`}
        />
        {/* midrib */}
        <path
          d="M6,104 C50,96 94,100 152,110"
          stroke="#E6D7BD"
          strokeOpacity="0.35"
          strokeWidth="2"
          fill="none"
        />
        {/* veins */}
        <path
          d="M40,96 C68,88 94,88 128,96"
          stroke="#E6D7BD"
          strokeOpacity="0.25"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M28,110 C60,104 96,104 156,114"
          stroke="#E6D7BD"
          strokeOpacity="0.25"
          strokeWidth="1"
          fill="none"
        />
      </g>

      <g transform="translate(350, 56) rotate(12)">
        {/* underside */}
        <path
          d="M-6,38 C36,12 100,8 148,30 C190,50 208,86 190,112 C160,106 120,108 86,118 C58,126 24,128 4,118 Z"
          fill={`url(#${ids.leafUnd})`}
          opacity="0.9"
        />
        {/* top face */}
        <path
          d="M-10,30 C40,2 110,0 162,26 C210,50 226,92 192,128 C152,114 114,116 76,126 C40,134 8,132 -10,114 Z"
          fill={`url(#${ids.leafTop})`}
        />
        <path
          d="M-6,112 C36,106 88,110 146,120"
          stroke="#E6D7BD"
          strokeOpacity="0.35"
          strokeWidth="2"
          fill="none"
        />
      </g>

      {/* Magnolia bloom (layered petals) */}
      <g transform="translate(256, 256)">
        {/* Back petals */}
        <Petal
          d="M0,-184 C-42,-156 -72,-120 -78,-74 C-84,-26 -58,10 0,22 C58,10 84,-26 78,-74 C72,-120 42,-156 0,-184 Z"
          fillId={ids.petal}
          shadowId={ids.petalShadow}
          rotate={0}
        />
        <Petal
          d="M0,-178 C-38,-152 -76,-110 -88,-66 C-98,-28 -90,4 -62,26 C-24,54 24,54 62,26 C90,4 98,-28 88,-66 C76,-110 38,-152 0,-178 Z"
          fillId={ids.petal}
          shadowId={ids.petalShadow}
          rotate={60}
        />
        <Petal
          d="M0,-176 C-40,-150 -74,-118 -84,-74 C-92,-40 -86,-12 -64,10 C-24,50 24,50 64,10 C86,-12 92,-40 84,-74 C74,-118 40,-150 0,-176 Z"
          fillId={ids.petal}
          shadowId={ids.petalShadow}
          rotate={120}
        />

        {/* Front petals (slightly larger and brighter) */}
        <Petal
          d="M0,-170 C-42,-142 -74,-110 -84,-66 C-92,-30 -78,2 -42,22 C-10,40 10,40 42,22 C78,2 92,-30 84,-66 C74,-110 42,-142 0,-170 Z"
          fillId={ids.petal}
          shadowId={ids.petalShadow}
          rotate={30}
          highlightId={ids.gloss}
          opacity={0.98}
        />
        <Petal
          d="M0,-168 C-36,-144 -70,-114 -82,-74 C-92,-42 -84,-12 -58,10 C-20,42 20,42 58,10 C84,-12 92,-42 82,-74 C70,-114 36,-144 0,-168 Z"
          fillId={ids.petal}
          shadowId={ids.petalShadow}
          rotate={-30}
          highlightId={ids.gloss}
          opacity={0.98}
        />

        {/* Central cone */}
        <g>
          <path
            d="M0,-24 C22,-24 34,-10 34,8 C34,30 20,54 0,62 C-20,54 -34,30 -34,8 C-34,-10 -22,-24 0,-24 Z"
            fill={`url(#${ids.cone})`}
            stroke="#B28B3F"
            strokeWidth="1.5"
          />
          {/* stamen ring */}
          {Array.from({ length: 22 }).map((_, i) => {
            const angle = (i / 22) * Math.PI * 2;
            const r = 48;
            const cx = Math.cos(angle) * r;
            const cy = Math.sin(angle) * r;
            return (
              <g
                key={i}
                transform={`translate(${cx}, ${cy}) rotate(${
                  (angle * 180) / Math.PI
                })`}
              >
                <ellipse
                  cx={0}
                  cy={0}
                  rx={5}
                  ry={8}
                  fill={`url(#${ids.stamen})`}
                  opacity={0.95}
                />
              </g>
            );
          })}
          {/* cone texture */}
          <g opacity={0.25} stroke="#B28B3F" strokeWidth="1" fill="none">
            <path d="M-20,0 C-12,8 -6,12 0,12 C6,12 12,8 20,0" />
            <path d="M-18,10 C-10,16 -6,20 0,20 C6,20 10,16 18,10" />
          </g>
        </g>
      </g>
    </svg>
  );
}

export function MagnoliaBadgeDetailed({
  className = "",
  ariaLabel = "Magnolia emblem",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  // same artwork, scaled centrally for badges/logos
  return <MagnoliaCornerDetailed className={className} ariaLabel={ariaLabel} />;
}

/* ——— Petal helper ——— */
function Petal({
  d,
  fillId,
  shadowId,
  highlightId,
  rotate = 0,
  opacity = 1,
}: {
  d: string;
  fillId: string;
  shadowId: string;
  highlightId?: string;
  rotate?: number;
  opacity?: number;
}) {
  return (
    <g transform={`rotate(${rotate})`} opacity={opacity}>
      <path
        d={d}
        fill={`url(#${fillId})`}
        stroke="#D9CDB3"
        strokeWidth="1.25"
      />
      {/* inner subtle shadow for depth */}
      <path d={d} fill={`url(#${shadowId})`} />
      {highlightId && (
        <path d={d} fill={`url(#${highlightId})`} opacity={0.3} />
      )}
      {/* fine veins */}
      <g stroke="#D6C8AB" strokeOpacity="0.35" strokeWidth="1" fill="none">
        <path d="M0,-120 C-6,-90 -6,-60 0,-30" />
        <path d="M-14,-110 C-18,-84 -18,-58 -12,-30" />
        <path d="M14,-110 C18,-84 18,-58 12,-30" />
      </g>
    </g>
  );
}

// Save as components/Magnolia.tsx
// A refined, more realistic southern magnolia illustration.
// Drop-in exports: <MagnoliaCornerV2 /> and <MagnoliaBadgeV2 />
// Colors stay within ivory · leaf‑green · soft gold, but can be overridden via props.

export type MagnoliaPalette = {
  petalLight?: string; // inner
  petalMid?: string; // midtone
  petalEdge?: string; // edge
  leafTopA?: string; // leaf gradient start
  leafTopB?: string; // leaf gradient end
  leafUndA?: string; // underside start (russet)
  leafUndB?: string; // underside end
  goldA?: string; // cone highlight
  goldB?: string; // cone base
  stroke?: string; // outline accent
};

const DEFAULTS: Required<MagnoliaPalette> = {
  petalLight: "#FFFAF2",
  petalMid: "#F3E9D6",
  petalEdge: "#E6D9C1",
  leafTopA: "#4B6C5A",
  leafTopB: "#2E4E3F",
  leafUndA: "#B8895B",
  leafUndB: "#8C5E34",
  goldA: "#ECD08A",
  goldB: "#C39F51",
  stroke: "#D8CCB3",
};

export function MagnoliaCornerV2({
  className = "",
  ariaLabel = "Decorative magnolia",
  palette = {},
}: {
  className?: string;
  ariaLabel?: string;
  palette?: MagnoliaPalette;
}) {
  const p = { ...DEFAULTS, ...palette };
  const uid = useId().replace(/[:]/g, "");
  const ids = useMemo(
    () => ({
      petalGrad: `petalGrad-${uid}`,
      petalShade: `petalShade-${uid}`,
      leafTop: `leafTop-${uid}`,
      leafUnd: `leafUnd-${uid}`,
      cone: `cone-${uid}`,
      stamen: `stamen-${uid}`,
      shadow: `shadow-${uid}`,
      grain: `grain-${uid}`,
    }),
    [uid]
  );

  return (
    <svg
      className={className}
      viewBox="0 0 640 640"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* Petal gradient with subtle warmth toward the edge */}
        <radialGradient id={ids.petalGrad} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor={p.petalLight} />
          <stop offset="60%" stopColor={p.petalMid} />
          <stop offset="100%" stopColor={p.petalEdge} />
        </radialGradient>
        {/* Inner petal shadow */}
        <linearGradient id={ids.petalShade} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        {/* Leaf top + underside */}
        <linearGradient id={ids.leafTop} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.leafTopA} />
          <stop offset="100%" stopColor={p.leafTopB} />
        </linearGradient>
        <linearGradient id={ids.leafUnd} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.leafUndA} />
          <stop offset="100%" stopColor={p.leafUndB} />
        </linearGradient>
        {/* Cone / center */}
        <linearGradient id={ids.cone} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={p.goldA} />
          <stop offset="100%" stopColor={p.goldB} />
        </linearGradient>
        <radialGradient id={ids.stamen} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={p.goldA} />
          <stop offset="100%" stopColor={p.goldB} />
        </radialGradient>
        {/* Soft drop shadow */}
        <filter
          id={ids.shadow}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="2" result="off" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.25" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Grain for subtle texture */}
        <filter id={ids.grain} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
            result="turb"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.035" />
          </feComponentTransfer>
          <feBlend in2="SourceGraphic" mode="multiply" />
        </filter>
      </defs>

      {/* Decorative gold speckles */}
      <g opacity={0.25}>
        <circle cx="28" cy="612" r="2.5" fill={p.goldB} />
        <circle cx="76" cy="580" r="1.5" fill={p.goldB} />
        <circle cx="612" cy="28" r="2.5" fill={p.goldB} />
        <circle cx="570" cy="62" r="1.5" fill={p.goldB} />
      </g>

      {/* Leaves framing the corner */}
      <g filter={`url(#${ids.shadow})`}>
        {/* underside (russet) peeking */}
        <path
          d="M46,486 C130,410 258,388 338,426 C412,462 440,520 410,566 C354,548 300,552 248,566 C194,582 114,574 70,540 Z"
          fill={`url(#${ids.leafUnd})`}
          opacity="0.95"
        />
        {/* glossy top surface */}
        <path
          d="M40,468 C124,392 264,368 356,408 C436,444 470,512 430,570 C372,546 314,554 248,574 C186,592 106,584 60,542 Z"
          fill={`url(#${ids.leafTop})`}
        />
        {/* midrib + veins */}
        <path
          d="M62,544 C138,528 220,536 310,556"
          stroke="#E7DAC1"
          strokeOpacity=".5"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M88,528 C140,516 208,520 296,540"
          stroke="#E7DAC1"
          strokeOpacity=".35"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M84,562 C154,548 226,554 314,574"
          stroke="#E7DAC1"
          strokeOpacity=".35"
          strokeWidth="1.2"
          fill="none"
        />
      </g>

      {/* Blossom */}
      <g transform="translate(330, 340)" filter={`url(#${ids.shadow})`}>
        {/* Back petal ring */}
        {petalRing(6, 180, 68, 124, ids, p.stroke).map((el) => el)}
        {/* Middle ring */}
        {petalRing(5, 150, 64, 118, ids, p.stroke, 18).map((el) => el)}
        {/* Front ring */}
        {petalRing(5, 120, 60, 112, ids, p.stroke, -10, 0.98).map((el) => el)}

        {/* Central cone and stamen */}
        <g>
          <path
            d="M0,-26 C18,-26 32,-12 32,10 C32,34 18,62 0,70 C-18,62 -32,34 -32,10 C-32,-12 -18,-26 0,-26 Z"
            fill={`url(#${ids.cone})`}
            stroke={p.goldB}
            strokeWidth={1.4}
          />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const r = 56;
            const cx = Math.cos(a) * r;
            const cy = Math.sin(a) * r;
            return (
              <g
                key={i}
                transform={`translate(${cx}, ${cy}) rotate(${
                  (a * 180) / Math.PI
                })`}
              >
                <ellipse
                  cx={0}
                  cy={0}
                  rx={4.8}
                  ry={7.6}
                  fill={`url(#${ids.stamen})`}
                />
              </g>
            );
          })}
        </g>
      </g>

      {/* subtle texture over petals only (masked by their shapes via filter blending) */}
      <rect
        x="0"
        y="0"
        width="640"
        height="640"
        fill="transparent"
        filter={`url(#${ids.grain})`}
        opacity="0.25"
      />
    </svg>
  );
}

export function MagnoliaBadgeV2({
  className = "",
  ariaLabel = "Magnolia emblem",
  palette = {},
}: {
  className?: string;
  ariaLabel?: string;
  palette?: MagnoliaPalette;
}) {
  return (
    <MagnoliaCornerV2
      className={className}
      ariaLabel={ariaLabel}
      palette={palette}
    />
  );
}

// —— Helpers —— //
function petalRing(
  count: number,
  radius: number,
  w: number,
  h: number,
  ids: any,
  stroke: string,
  rotationOffset = 0,
  opacity = 0.9
) {
  const out: JSX.Element[] = [];
  for (let i = 0; i < count; i++) {
    const a = (360 / count) * i + rotationOffset;
    const rad = (a * Math.PI) / 180;
    const x = Math.cos(rad) * 0;
    const y = Math.sin(rad) * 0;
    out.push(
      <g
        key={`p-${count}-${i}`}
        transform={`translate(${x}, ${y}) rotate(${a})`}
        opacity={opacity}
      >
        <PetalPath
          w={w}
          h={h}
          fillId={ids.petalGrad}
          shadeId={ids.petalShade}
          stroke={stroke}
        />
      </g>
    );
  }
  return out;
}

function PetalPath({
  w,
  h,
  fillId,
  shadeId,
  stroke,
}: {
  w: number;
  h: number;
  fillId: string;
  shadeId: string;
  stroke: string;
}) {
  // Teardrop-ish magnolia petal with a gentle waist and rounded tip
  const d = buildPetalPath(w, h, 0.22);
  return (
    <g>
      <path d={d} fill={`url(#${fillId})`} stroke={stroke} strokeWidth={1.15} />
      {/* inner shadow at base */}
      <path d={d} fill={`url(#${shadeId})`} />
      {/* subtle veins */}
      <path
        d={buildVeinPath(w, h)}
        fill="none"
        stroke={stroke}
        strokeOpacity={0.35}
        strokeWidth={0.9}
      />
    </g>
  );
}

function buildPetalPath(w: number, h: number, waist = 0.2) {
  // symmetrical petal around (0,0), drawn pointing up
  const top = -h;
  const base = 0;
  const half = w / 2;
  const ctrlX = half * (1 + waist);
  const ctrlIn = h * 0.55;
  const ctrlOut = h * 0.35;
  return [
    `M 0 ${base}`,
    // left side
    `C ${-half} ${base - ctrlOut}, ${-ctrlX} ${top + ctrlIn}, 0 ${top}`,
    // right side
    `C ${ctrlX} ${top + ctrlIn}, ${half} ${base - ctrlOut}, 0 ${base}`,
    "Z",
  ].join(" ");
}

function buildVeinPath(w: number, h: number) {
  const top = -h;
  return [
    `M 0 ${top + 18}`,
    `C -${w * 0.12} ${top + h * 0.35}, -${w * 0.08} ${top + h * 0.62}, 0 ${
      -h * 0.22
    }`,
    `M 0 ${top + 18}`,
    `C ${w * 0.12} ${top + h * 0.35}, ${w * 0.08} ${top + h * 0.62}, 0 ${
      -h * 0.22
    }`,
  ].join(" ");
}
