/**
 * AuroraBackground
 *
 * A fixed, full-viewport animated gradient mesh that sits behind all
 * content. Three layers of blurred radial-gradient blobs stacked with
 * blend modes; each animates transform only (GPU-friendly, zero JS).
 *
 * Must be rendered at the root of the layout so it covers the whole
 * viewport regardless of the current route.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="aurora-root">
      <div className="aurora-layer aurora-layer-1" />
      <div className="aurora-layer aurora-layer-2" />
      <div className="aurora-layer aurora-layer-3" />
    </div>
  );
}
