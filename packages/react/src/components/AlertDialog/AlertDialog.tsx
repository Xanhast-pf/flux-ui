import {
  NativeModal,
  type NativeModalStyles,
} from "../../internal/NativeModal.js";
import {
  close,
  description,
  popup,
  title,
  trigger,
} from "./AlertDialog.css.js";
import type {
  AlertDialogPopupProps,
  AlertDialogRootProps,
} from "./AlertDialog.types.js";
const styles: NativeModalStyles = { close, description, popup, title, trigger };
function Root(props: AlertDialogRootProps) {
  return <NativeModal.Root {...props} styles={styles} />;
}
function Popup(props: AlertDialogPopupProps) {
  return (
    <NativeModal.Popup {...props} role="alertdialog" closeOnBackdrop={false} />
  );
}
/** Put the least destructive action first in reading/focus order. Escape cancels. */
export const AlertDialog = {
  Root,
  Popup,
  Trigger: NativeModal.Trigger,
  Close: NativeModal.Close,
  Title: NativeModal.Title,
  Description: NativeModal.Description,
} as const;
