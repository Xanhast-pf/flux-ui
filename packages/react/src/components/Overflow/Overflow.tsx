import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ContextType,
} from "react";
import {
  OverflowCapabilityContext,
  type OverflowCollectionProps,
} from "../../internal/overflowCapability.js";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { Select } from "../Select/Select.js";
import { collection, control, overflow } from "./Overflow.css.js";
import type { OverflowProps } from "./Overflow.types.js";
import { useOverflowItems } from "./useOverflowItems.js";

const OwnerContext = createContext<Set<HTMLElement> | null>(null);
function Collection(props: OverflowCollectionProps) {
  const { children, label = "More items" } = props;
  const scope = useRef<HTMLDivElement>(null);
  const owner = useContext(OwnerContext);
  const trigger = useRef<HTMLSelectElement>(null);
  useLayoutEffect(() => {
    const node = scope.current?.firstElementChild;
    if (!owner || !(node instanceof HTMLElement)) return;
    if (owner.size)
      throw new Error(
        "Overflow supports one collection. Wrap each collection in its own Overflow.",
      );
    owner.add(node);
    return () => {
      owner.delete(node);
    };
  }, [owner, scope]);
  const items = useOverflowItems(scope, props, trigger);
  const active = items.length > 0;
  return (
    <div ref={scope} className={collection} data-active={active || undefined}>
      {children}
      <Select
        className={control}
        ref={trigger}
        aria-label={label}
        aria-hidden={!active}
        inert={!active}
        tabIndex={active ? 0 : -1}
        value=""
        onChange={(event) => {
          const item = items.find(({ id }) => id === event.currentTarget.value);
          if (!item || item.disabled) return;
          item.node.removeAttribute("inert");
          item.node.removeAttribute("data-flux-overflowed");
          item.node.click();
        }}
      >
        <option value="" disabled>
          {label}
        </option>
        {items.map(({ id, label, disabled }) => (
          <option key={id} value={id} disabled={disabled}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
}

const enhance: NonNullable<ContextType<typeof OverflowCapabilityContext>> = (
  children,
  capability,
) => <Collection {...capability}>{children}</Collection>;

/** Enhances one registered Flux collection; unsupported children pass through. */
export function Overflow({ children, className, ...props }: OverflowProps) {
  const [owner] = useState(() => new Set<HTMLElement>());
  return (
    <OwnerContext value={owner}>
      <OverflowCapabilityContext value={enhance}>
        <div {...props} className={joinClassNames(overflow, className)}>
          {children}
        </div>
      </OverflowCapabilityContext>
    </OwnerContext>
  );
}
