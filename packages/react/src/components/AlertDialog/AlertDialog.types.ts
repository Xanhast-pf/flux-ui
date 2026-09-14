import type {
  DialogRootProps,
  DialogPopupProps,
  DialogTriggerProps,
  DialogCloseProps,
  DialogTitleProps,
  DialogDescriptionProps,
} from "../Dialog/Dialog.types.js";
export type AlertDialogRootProps = DialogRootProps;
export type AlertDialogPopupProps = Omit<
  DialogPopupProps,
  "role" | "closeOnBackdrop"
>;
export type AlertDialogTriggerProps = DialogTriggerProps;
export type AlertDialogCloseProps = DialogCloseProps;
export type AlertDialogTitleProps = DialogTitleProps;
export type AlertDialogDescriptionProps = DialogDescriptionProps;
