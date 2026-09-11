import type { ReactNode } from "react";
import { FluxMarkIcon } from "@flux-ui/icons";
export function SceneHeader({
  brand,
  context,
  children,
}: {
  brand: string;
  context: string;
  children?: ReactNode;
}) {
  return (
    <header className="scene-header">
      <div className="scene-brand">
        <FluxMarkIcon size={20} />
        <strong>{brand}</strong>
        <span>{context}</span>
      </div>
      <div className="scene-header-actions">{children}</div>
    </header>
  );
}
export function SceneStatus({ children }: { children: ReactNode }) {
  return (
    <p className="scene-status" role="status">
      {children}
    </p>
  );
}
export function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="scene-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}
