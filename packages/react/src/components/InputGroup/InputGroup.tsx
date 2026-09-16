import { joinClassNames } from "../../internal/joinClassNames.js";
import { Input } from "../Input/Input.js";
import { addon, root } from "./InputGroup.css.js";
import type {
  InputGroupAddonProps,
  InputGroupInputProps,
  InputGroupRootProps,
} from "./InputGroup.types.js";
function Root({ className, ...props }: InputGroupRootProps) {
  return <div {...props} className={joinClassNames(root, className)} />;
}
function Addon({ className, ...props }: InputGroupAddonProps) {
  return <span {...props} className={joinClassNames(addon, className)} />;
}
function Control(props: InputGroupInputProps) {
  return <Input {...props} />;
}
export const InputGroup = { Root, Addon, Input: Control } as const;
