import {
  NativeModal,
  containsNativeModalPart,
  type NativeModalStyles,
} from "../../internal/NativeModal.js";
import { close, description, popup, title, trigger } from "./Dialog.css.js";
import type { DialogPopupProps, DialogRootProps } from "./Dialog.types.js";

const dialogStyles: NativeModalStyles = {
  close,
  description,
  popup,
  title,
  trigger,
};

function DialogPopup(props: DialogPopupProps) {
  return <NativeModal.Popup {...props} />;
}

function DialogRoot(props: DialogRootProps) {
  const hasDescription = containsNativeModalPart(
    props.children,
    NativeModal.Description,
    DialogPopup,
  );
  const hasTitle = containsNativeModalPart(
    props.children,
    NativeModal.Title,
    DialogPopup,
  );

  return (
    <NativeModal.Root
      {...props}
      hasDescription={hasDescription}
      hasTitle={hasTitle}
      styles={dialogStyles}
    />
  );
}

export const Dialog = {
  Close: NativeModal.Close,
  Description: NativeModal.Description,
  Popup: DialogPopup,
  Root: DialogRoot,
  Title: NativeModal.Title,
  Trigger: NativeModal.Trigger,
} as const;
