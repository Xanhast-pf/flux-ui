import {
  fluxDisplayGlyphs,
  fluxDisplayMetrics,
  normalizeFluxDisplayText,
} from "@flux-ui/identity";

export function FluxDisplay({
  text,
  size = 80,
  className,
}: {
  text: string;
  size?: number;
  className?: string;
}) {
  const normalized = normalizeFluxDisplayText(text);
  let cursor = 0;
  const glyphs = [...normalized].map((character) => {
    const glyph = fluxDisplayGlyphs[character] ?? fluxDisplayGlyphs[" "];
    if (glyph === undefined) {
      throw new Error("Flux Display must define a space glyph.");
    }
    const x = cursor;
    cursor += glyph.advance + fluxDisplayMetrics.letterGap;
    return { character, glyph, x };
  });
  const width = Math.max(cursor - fluxDisplayMetrics.letterGap, 1);
  const padding = fluxDisplayMetrics.renderPadding;
  const viewBoxWidth = width + padding * 2;
  const viewBoxHeight = fluxDisplayMetrics.designGridHeight + padding * 2;

  return (
    <svg
      aria-label={normalized || undefined}
      aria-hidden={normalized ? undefined : true}
      className={className}
      fill="none"
      height={size}
      preserveAspectRatio="xMinYMid meet"
      role={normalized ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeWidth={fluxDisplayMetrics.strokeWidth}
      viewBox={`${-padding} ${-padding} ${viewBoxWidth} ${viewBoxHeight}`}
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      {glyphs.map(({ character, glyph, x }) =>
        glyph.path ? (
          <path
            aria-hidden="true"
            d={glyph.path}
            key={`${x}-${character}`}
            transform={`translate(${x} 0)`}
          />
        ) : null,
      )}
    </svg>
  );
}
