import { chartBox } from "../Chart/chartModel.js";
import type {
  ScatterChartPoint,
  ScatterChartSeries,
} from "./ScatterChart.types.js";

export interface ScatterSeriesModel {
  id: string;
  indexes: readonly number[];
  path: string;
}

function reducedIndexes(
  data: readonly ScatterChartPoint[],
  maxPoints: number,
): number[] {
  const length = data.length;
  if (length <= maxPoints) return data.map((_, sourceIndex) => sourceIndex);

  const picked: number[] = [];
  let previous = -1;
  for (let slot = 0; slot < maxPoints; slot += 1) {
    const sourceIndex = Math.round((slot * (length - 1)) / (maxPoints - 1));
    if (sourceIndex === previous) continue;
    picked.push(sourceIndex);
    previous = sourceIndex;
  }
  return picked;
}

export function scatterModel(
  series: readonly ScatterChartSeries[],
  maxPoints: number,
) {
  if (!Number.isInteger(maxPoints) || maxPoints < 4 || maxPoints > 8192)
    throw new RangeError(
      "ScatterChart.maxPoints must be an integer from 4 to 8192.",
    );
  if (
    series.length > 32 ||
    new Set(series.map((item) => item.id)).size !== series.length
  )
    throw new RangeError(
      "Scatter charts need unique series IDs and at most 32 series.",
    );

  let sourcePoints = 0;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const item of series) {
    if (!item.id || !item.label)
      throw new Error("Every scatter series needs an ID and label.");
    sourcePoints += item.data.length;
    if (sourcePoints > 200_000)
      throw new RangeError(
        "ScatterChart source budget is 200,000 points; aggregate upstream.",
      );
    for (const point of item.data) {
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y))
        throw new RangeError("ScatterChart points must use finite x/y values.");
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }
  }

  if (!Number.isFinite(minX)) {
    minX = 0;
    maxX = 1;
    minY = 0;
    maxY = 1;
  }
  if (minX === maxX) {
    const padding = Math.max(1, Math.abs(minX) * 0.05);
    minX -= padding;
    maxX += padding;
  }
  if (minY === maxY) {
    const padding = Math.max(1, Math.abs(minY) * 0.05);
    minY -= padding;
    maxY += padding;
  }
  if (
    !Number.isFinite(maxX - minX) ||
    !Number.isFinite(maxY - minY) ||
    maxX <= minX ||
    maxY <= minY
  )
    throw new RangeError(
      "ScatterChart domain is outside the representable numeric range.",
    );

  const width = chartBox.width - chartBox.left - chartBox.right;
  const height = chartBox.height - chartBox.top - chartBox.bottom;
  const x = (value: number) =>
    chartBox.left + ((value - minX) / (maxX - minX)) * width;
  const y = (value: number) =>
    chartBox.top + ((maxY - value) / (maxY - minY)) * height;
  const number = (value: number) => Number(value.toFixed(2));

  const models = series.map((item): ScatterSeriesModel => {
    const indexes = reducedIndexes(item.data, maxPoints);
    const path = indexes
      .map((sourceIndex) => {
        const point = item.data[sourceIndex];
        if (!point) return "";
        const px = number(x(point.x));
        const py = number(y(point.y));
        return `M${px + 2.5},${py}a2.5,2.5 0 1,0 -5,0a2.5,2.5 0 1,0 5,0`;
      })
      .join(" ");
    return { id: item.id, indexes, path };
  });

  return { series: models, minY, maxY, x, y };
}

export function nearestRenderedScatterIndex(
  indexes: readonly number[],
  data: readonly ScatterChartPoint[],
  x: number,
  y: number,
  projectX: (value: number) => number,
  projectY: (value: number) => number,
): number {
  let best = 0;
  let distance = Infinity;
  for (let index = 0; index < indexes.length; index += 1) {
    const sourceIndex = indexes[index];
    if (sourceIndex === undefined) continue;
    const point = data[sourceIndex];
    if (!point) continue;
    const dx = projectX(point.x) - x;
    const dy = projectY(point.y) - y;
    const next = dx * dx + dy * dy;
    if (next < distance) {
      distance = next;
      best = index;
    }
  }
  return best;
}
