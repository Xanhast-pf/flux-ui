export const cssVars = {
  color: {
    canvas: "--flux-color-canvas",
    surface: "--flux-color-surface",
    surfaceElevated: "--flux-color-surface-elevated",
    text: "--flux-color-text",
    textMuted: "--flux-color-text-muted",
    border: "--flux-color-border",
    accent: "--flux-color-accent",
    accentHover: "--flux-color-accent-hover",
    accentForeground: "--flux-color-accent-foreground",
    danger: "--flux-color-danger",
    dangerHover: "--flux-color-danger-hover",
    dangerForeground: "--flux-color-danger-foreground",
    focus: "--flux-color-focus",
  },
  space: {
    1: "--flux-space-1",
    2: "--flux-space-2",
    3: "--flux-space-3",
    4: "--flux-space-4",
    5: "--flux-space-5",
  },
  radius: {
    sm: "--flux-radius-sm",
    md: "--flux-radius-md",
    lg: "--flux-radius-lg",
  },
  control: {
    sm: "--flux-control-sm",
    md: "--flux-control-md",
    lg: "--flux-control-lg",
  },
  motion: {
    fast: "--flux-motion-fast",
    normal: "--flux-motion-normal",
    easing: "--flux-motion-easing",
  },
} as const;

export const primitiveTokens = {
  space: { 1: "0.25rem", 2: "0.5rem", 3: "0.75rem", 4: "1rem", 5: "1.5rem" },
  radius: { sm: "0.375rem", md: "0.625rem", lg: "0.875rem" },
  control: { sm: "2rem", md: "2.5rem", lg: "3rem" },
  motion: {
    fast: "100ms",
    normal: "180ms",
    easing: "cubic-bezier(0.2, 0, 0, 1)",
  },
} as const;
