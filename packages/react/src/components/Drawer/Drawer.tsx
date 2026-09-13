import {
  NativeModal,
  type NativeModalStyles,
} from "../../internal/NativeModal.js";
import { close, description, popup, title, trigger } from "./Drawer.css.js";
import type { DrawerPopupProps, DrawerRootProps } from "./Drawer.types.js";

const drawerStyles: NativeModalStyles = {
  close,
  description,
  popup,
  title,
  trigger,
};

function DrawerPopup({ side = "right", ...props }: DrawerPopupProps) {
  return <NativeModal.Popup {...props} data-side={side} />;
}

function DrawerRoot(props: DrawerRootProps) {
  return <NativeModal.Root {...props} styles={drawerStyles} />;
}

export const Drawer = {
  Close: NativeModal.Close,
  Description: NativeModal.Description,
  Popup: DrawerPopup,
  Root: DrawerRoot,
  Title: NativeModal.Title,
  Trigger: NativeModal.Trigger,
} as const;
