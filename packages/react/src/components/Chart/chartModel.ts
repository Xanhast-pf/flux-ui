import type { ChartPoint, ChartSeries } from "./Chart.types.js";
export const chartBox = {
  width: 640,
  height: 280,
  left: 80,
  right: 16,
  top: 16,
  bottom: 32,
} as const;

/** Endpoints and bucket extrema survive reduction; nulls never become connecting lines. */
export function reduceChartPoints(
  data: readonly ChartPoint[],
  maxPoints: number,
): ChartPoint[][] {
  if (!Number.isInteger(maxPoints) || maxPoints < 4 || maxPoints > 8192)
    throw new RangeError("Invalid chart reduction budget.");
  const segments: ChartPoint[][] = [];
  let current: ChartPoint[] = [];
  for (const point of data) {
    if (point.y === null) {
      if (current.length) segments.push(current);
      current = [];
    } else current.push(point);
  }
  if (current.length) segments.push(current);
  if (segments.reduce((sum, segment) => sum + segment.length, 0) <= maxPoints)
    return segments;
  if (segments.length * 4 > maxPoints)
    throw new RangeError(
      "Too many chart gaps for maxPoints; aggregate upstream or increase the rendering budget.",
    );
  const budget = Math.floor(maxPoints / Math.max(1, segments.length));
  return segments.map((segment) => {
    if (segment.length <= budget) return segment;
    const selected = new Set<number>([0, segment.length - 1]);
    const buckets = Math.max(1, Math.floor((budget - 2) / 2));
    for (let bucket = 0; bucket < buckets; bucket += 1) {
      const start = 1 + Math.floor((bucket * (segment.length - 2)) / buckets);
      const end =
        1 + Math.floor(((bucket + 1) * (segment.length - 2)) / buckets);
      let min = start,
        max = start;
      for (let i = start; i < end; i += 1) {
        if ((segment[i]?.y ?? Infinity) < (segment[min]?.y ?? Infinity))
          min = i;
        if ((segment[i]?.y ?? -Infinity) > (segment[max]?.y ?? -Infinity))
          max = i;
      }
      selected.add(min);
      selected.add(max);
    }
    return [...selected]
      .sort((a, b) => a - b)
      .flatMap((index) => {
        const point = segment[index];
        return point ? [point] : [];
      });
  });
}

export function chartModel(
  series: readonly ChartSeries[],
  maxPoints: number,
  type: "line" | "area" | "bar",
) {
  if (!Number.isInteger(maxPoints) || maxPoints < 4 || maxPoints > 8192)
    throw new RangeError("Chart.maxPoints must be an integer from 4 to 8192.");
  if (
    series.length > 32 ||
    new Set(series.map((item) => item.id)).size !== series.length
  )
    throw new RangeError(
      "Charts need unique series IDs and at most 32 series.",
    );
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity,
    sourcePoints = 0;
  for (const item of series) {
    if (!item.id || !item.label)
      throw new Error("Every chart series needs an ID and label.");
    sourcePoints += item.data.length;
    if (sourcePoints > 200_000)
      throw new RangeError(
        "Chart source budget is 200,000 samples; aggregate or window upstream.",
      );
    let previousX = -Infinity;
    for (const point of item.data) {
      if (
        !Number.isFinite(point.x) ||
        point.x <= previousX ||
        (point.y !== null && !Number.isFinite(point.y))
      )
        throw new RangeError(
          "Chart x values must be finite and increasing; y must be finite or null.",
        );
      previousX = point.x;
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      if (point.y !== null) {
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      }
    }
  }
  if (!Number.isFinite(minX)) {
    minX = 0;
    maxX = 1;
  }
  if (!Number.isFinite(minY)) {
    minY = 0;
    maxY = 1;
  }
  if (type !== "line") {
    minY = Math.min(0, minY);
    maxY = Math.max(0, maxY);
  }
  if (minX === maxX) {
    minX -= 0.5;
    maxX += 0.5;
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
      "Chart domain is outside the representable numeric range.",
    );
  // Keep endpoint bars inside the plotting rectangle instead of clipping half a category.
  let categorySpacing = maxX - minX;
  if (type === "bar") {
    const categories = [
      ...new Set(series.flatMap((item) => item.data.map((point) => point.x))),
    ].sort((a, b) => a - b);
    let spacing = Infinity;
    for (let i = 1; i < categories.length; i += 1) {
      const current = categories[i],
        previous = categories[i - 1];
      if (current !== undefined && previous !== undefined)
        spacing = Math.min(spacing, current - previous);
    }
    categorySpacing = Number.isFinite(spacing) ? spacing : maxX - minX;
    const padding = Number.isFinite(spacing) ? spacing / 2 : (maxX - minX) / 2;
    minX -= padding;
    maxX += padding;
    if (![minX, maxX, maxX - minX].every(Number.isFinite))
      throw new RangeError(
        "Bar chart domain is outside the representable numeric range.",
      );
  }
  const width = chartBox.width - chartBox.left - chartBox.right;
  const height = chartBox.height - chartBox.top - chartBox.bottom;
  const x = (value: number) =>
    chartBox.left + ((value - minX) / (maxX - minX)) * width;
  const y = (value: number) =>
    chartBox.top + ((maxY - value) / (maxY - minY)) * height;
  const number = (value: number) => Number(value.toFixed(2));
  const pointText = (point: ChartPoint) =>
    `${number(x(point.x))},${number(y(point.y ?? 0))}`;
  const paths = series.map((item, index) => {
    if (type === "bar" && item.data.length > maxPoints)
      throw new RangeError(
        "Bar charts never discard categories. Increase maxPoints or aggregate upstream.",
      );
    const segments = reduceChartPoints(item.data, maxPoints);
    const gap = (categorySpacing / (maxX - minX)) * width;
    const barWidth = Math.min(32, (gap * 0.7) / Math.max(1, series.length));
    if (type === "bar" && barWidth < 0.5)
      throw new RangeError(
        "Bar categories are too dense for this chart. Aggregate upstream rather than overlapping categories.",
      );
    const baseline = number(y(0));
    const line =
      type !== "bar"
        ? segments
            .map(
              (segment) =>
                segment
                  .map(
                    (point, i) => `${i === 0 ? "M" : "L"}${pointText(point)}`,
                  )
                  .join(" ") + (segment.length === 1 ? "l0,0" : ""),
            )
            .join(" ")
        : "";
    const area =
      type === "area"
        ? segments
            .map((segment) => {
              const first = segment[0],
                last = segment[segment.length - 1];
              if (!first || !last) return "";
              return `M${number(x(first.x))},${baseline} ${segment.map((point) => `L${pointText(point)}`).join(" ")} L${number(x(last.x))},${baseline}Z`;
            })
            .join(" ")
        : "";
    const bars =
      type === "bar"
        ? item.data
            .filter((point) => point.y !== null)
            .map((point) => {
              const left = number(
                x(point.x) + (index - series.length / 2) * barWidth,
              );
              return `M${left},${baseline}V${number(y(point.y ?? 0))}h${number(barWidth)}V${baseline}Z`;
            })
            .join(" ")
        : "";
    return {
      id: item.id,
      line,
      area,
      bars,
      renderedPoints: segments.reduce(
        (sum, segment) => sum + segment.length,
        0,
      ),
    };
  });
  return {
    paths,
    minX,
    maxX,
    minY,
    maxY,
    x,
    y,
    sourcePoints,
    renderedPoints: paths.reduce((sum, item) => sum + item.renderedPoints, 0),
  };
}

export function nearestChartIndex(
  data: readonly ChartPoint[],
  x: number,
): number {
  let low = 0,
    high = data.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if ((data[middle]?.x ?? Infinity) < x) low = middle + 1;
    else high = middle;
  }
  const previous = data[low - 1],
    current = data[low];
  return previous && current && x - previous.x <= current.x - x ? low - 1 : low;
}
