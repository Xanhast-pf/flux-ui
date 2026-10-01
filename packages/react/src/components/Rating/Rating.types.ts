import type {
  ChangeEvent,
  ChangeEventHandler,
  ComponentPropsWithRef,
} from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";

export type RatingValue = number | null;

export type RatingValueChangeHandler = (
  value: number,
  event: ChangeEvent<HTMLInputElement>,
) => void;

type RatingRootProps = Omit<
  ComponentPropsWithRef<"fieldset">,
  "children" | "defaultValue" | "name" | "onChange"
> &
  AccessibleName & {
    /** Accessible label for an individual rating option. */
    getItemLabel?: ((value: number, max: number) => string) | undefined;
    /** Number of rating options. Integer values from 1 through 10 are supported. */
    max?: number | undefined;
    /** Native radio-group/form field name. */
    name?: string | undefined;
    /** Selection precision. Defaults to whole stars. */
    step?: 1 | 0.5 | undefined;
  };

type RatingMode =
  | {
      readOnly?: false | undefined;
      required?: boolean | undefined;
      onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
    }
  | {
      /** Renders the current value as non-interactive rating content. */
      readOnly: true;
      required?: never;
      onChange?: never;
    };

type RatingValueState =
  | {
      value: RatingValue;
      defaultValue?: never;
      onValueChange: RatingValueChangeHandler;
    }
  | {
      value?: undefined;
      defaultValue?: RatingValue | undefined;
      onValueChange?: RatingValueChangeHandler | undefined;
    };

export type RatingProps = RatingRootProps & RatingMode & RatingValueState;
