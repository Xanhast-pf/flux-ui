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
    !Number.isFinite(max - min) ||
    !Number.isFinite((max - min) / (step / 10)) ||
    (scale === "log" && min <= 0)
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
  const bounded = Math.max(min, Math.min(max, value));
  return scale === "log"
    ? (Math.log(bounded) - Math.log(min)) / (Math.log(max) - Math.log(min))
    : (bounded - min) / (max - min);
}
export function snapKnob(
  value: number,
  min: number,
  max: number,
  step: number,
) {
  return Math.max(
    min,
    Math.min(
      max,
      Number((Math.round((value - min) / step) * step + min).toPrecision(12)),
    ),
  );
}
export function knobValue(
  fraction: number,
  min: number,
  max: number,
  scale: "linear" | "log",
) {
  const bounded = Math.max(0, Math.min(1, fraction));
  return scale === "log"
    ? Math.exp(Math.log(min) + bounded * (Math.log(max) - Math.log(min)))
    : min + bounded * (max - min);
}
