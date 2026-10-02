import type { PieChartDatum } from "./PieChart.types.js";

export const pieBox = {
  width: 320,
  height: 240,
  centerX: 160,
  centerY: 120,
  radius: 96,
} as const;

export interface PieSliceModel {
  end: number;
  path: string;
}

const tau = Math.PI * 2;

function point(angle: number): [number, number] {
  const x = pieBox.centerX + Math.cos(angle - Math.PI / 2) * pieBox.radius;
  const y = pieBox.centerY + Math.sin(angle - Math.PI / 2) * pieBox.radius;
  return [Number(x.toFixed(2)), Number(y.toFixed(2))];
}

function slicePath(start: number, end: number): string {
  const span = end - start;
  if (span <= 0) return "";
  const [sx, sy] = point(start);
  if (span >= tau - 1e-9) {
    const [mx, my] = point(start + Math.PI);
    return `M${pieBox.centerX},${pieBox.centerY} L${sx},${sy} A${pieBox.radius},${pieBox.radius} 0 1 1 ${mx},${my} A${pieBox.radius},${pieBox.radius} 0 1 1 ${sx},${sy} Z`;
  }
  const [ex, ey] = point(end);
  const large = span > Math.PI ? 1 : 0;
  return `M${pieBox.centerX},${pieBox.centerY} L${sx},${sy} A${pieBox.radius},${pieBox.radius} 0 ${large} 1 ${ex},${ey} Z`;
}

export function pieModel(
  data: readonly PieChartDatum[],
  maxSlices: number,
): { slices: readonly PieSliceModel[]; total: number } {
  if (!Number.isInteger(maxSlices) || maxSlices < 1 || maxSlices > 256)
    throw new RangeError(
      "PieChart.maxSlices must be an integer from 1 to 256.",
    );
  if (data.length > maxSlices)
    throw new RangeError(
      "PieChart data exceeds maxSlices; aggregate small categories upstream.",
    );
  if (new Set(data.map((datum) => datum.id)).size !== data.length)
    throw new RangeError("PieChart slice IDs must be unique.");

  let total = 0;
  for (const datum of data) {
    if (!datum.id || !datum.label)
      throw new Error("Every pie slice needs an ID and label.");
    if (!Number.isFinite(datum.value) || datum.value < 0)
      throw new RangeError("PieChart values must be finite and non-negative.");
    total += datum.value;
  }
  if (!Number.isFinite(total))
    throw new RangeError("PieChart total is outside the numeric range.");
  if (data.length > 0 && total <= 0)
    throw new RangeError(
      "PieChart needs a positive total when data is present.",
    );

  let cursor = 0;
  const slices = data.map((datum) => {
    const start = cursor;
    const end = cursor + (datum.value / total) * tau;
    cursor = end;
    return { end, path: slicePath(start, end) };
  });
  return { slices, total };
}

export function pieIndexAtAngle(
  slices: readonly PieSliceModel[],
  angle: number,
): number {
  if (slices.length === 0) return 0;
  const normalized = ((angle % tau) + tau) % tau;
  const index = slices.findIndex((slice) => normalized < slice.end);
  return index === -1 ? slices.length - 1 : index;
}
