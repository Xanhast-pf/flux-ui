import { useCallback, useState, type ReactNode } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { avatar, picture } from "./Avatar.css.js";
import type { AvatarProps } from "./Avatar.types.js";
function AvatarPicture({
  src,
  fallback,
}: {
  src: string;
  fallback: ReactNode;
}) {
  const [phase, setPhase] = useState<"loading" | "loaded" | "failed">(
    "loading",
  );
  const imageRef = useCallback((node: HTMLImageElement | null) => {
    // A cached server image may finish before hydration installs onLoad.
    if (node?.complete) setPhase(node.naturalWidth > 0 ? "loaded" : "failed");
  }, []);
  // The keyed child resets on a changed source. Removing the fallback after load
  // also avoids initials showing through transparent images.
  return (
    <>
      {phase !== "loaded" ? <span aria-hidden="true">{fallback}</span> : null}
      {phase !== "failed" ? (
        <img
          src={src}
          alt=""
          className={picture}
          decoding="async"
          ref={imageRef}
          onLoad={() => {
            setPhase("loaded");
          }}
          onError={() => {
            setPhase("failed");
          }}
        />
      ) : null}
    </>
  );
}
export function Avatar({
  alt,
  className,
  fallback = "?",
  size = "md",
  shape = "circle",
  src,
  ...props
}: AvatarProps) {
  return (
    <span
      {...props}
      className={joinClassNames(avatar, className)}
      data-s={size === "md" ? undefined : size}
      data-h={shape === "circle" ? undefined : shape}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? props["aria-hidden"] : true}
    >
      {src ? (
        <AvatarPicture key={src} src={src} fallback={fallback} />
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </span>
  );
}
