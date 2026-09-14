export function validateKnob(
  min: number,
  max: number,
  step: number,
  scale: "linear" | "log",
) {
  if (
    ![min, max, step].every(Number.isFinite) ||
    max <= min ||
    step <= 0 ||
    !Number.isFinite((max - min) / (step / 10)) ||
    (scale === "log" && (min <= 0 || Math.log(max) <= Math.log(min)))
  )
    throw new RangeError(
      "Knob needs a finite increasing range, positive step and a positive log minimum.",
    );
}
export function knobFraction(
  value: number,
  min: number,
  max: number,
  scale: "linear" | "log",
) {
  if (value <= min) return 0;
  if (value >= max) return 1;
  return scale === "log"
    ? (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))
    : (value - min) / (max - min);
}
export function snapKnob(
  value: number,
  min: number,
  max: number,
  step: number,
) {
  if (value <= min) return min;
  if (value >= max) return max;
  const snapped = Math.round((value - min) / step) * step + min;
  const rounded = Number(snapped.toPrecision(12));
  // Remove decimal noise only when doing so cannot erase a meaningful step.
  return Math.max(
    min,
    Math.min(
      max,
      Math.abs(rounded - snapped) < step * 1e-6 ? rounded : snapped,
    ),
  );
}
export function knobValue(
  fraction: number,
  min: number,
  max: number,
  scale: "linear" | "log",
) {
  if (fraction <= 0) return min;
  if (fraction >= 1) return max;
  return scale === "log"
    ? Math.exp(Math.log(min) + fraction * (Math.log(max) - Math.log(min)))
    : min + fraction * (max - min);
}

/** Move to the adjacent step, including from a non-grid endpoint. */
export function stepKnob(
  value: number,
  min: number,
  max: number,
  step: number,
  ticks: number,
): number {
  const position = (value - min) / step;
  const nearest = Math.round(position);
  const aligned = Math.abs(position - nearest) < 1e-9 ? nearest : position;
  const index = (ticks > 0 ? Math.floor(aligned) : Math.ceil(aligned)) + ticks;
  return snapKnob(min + index * step, min, max, step);
}
