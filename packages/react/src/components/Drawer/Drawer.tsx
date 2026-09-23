import {
  NativeModal,
  type NativeModalStyles,
} from "../../internal/NativeModal.js";
import { close, description, popup, title, trigger } from "./Drawer.css.js";
import type { DrawerPopupProps, DrawerRootProps } from "./Drawer.types.js";

const drawerStyles: NativeModalStyles = {
  close,
  trigger,
  description,
  title,
  popup,
};

const DrawerPopup = ({ side = "right", ...props }: DrawerPopupProps) => (
  <NativeModal.Popup {...props} data-side={side} />
);

const DrawerRoot = (props: DrawerRootProps) => (
  <NativeModal.Root {...props} styles={drawerStyles} />
);

export const Drawer = {
  Close: NativeModal.Close,
  Description: NativeModal.Description,
  Popup: DrawerPopup,
  Root: DrawerRoot,
  Title: NativeModal.Title,
  Trigger: NativeModal.Trigger,
} as const;
