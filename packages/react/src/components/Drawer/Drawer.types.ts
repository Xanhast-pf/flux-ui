import type {
  NativeModalCloseProps,
  NativeModalDescriptionProps,
  NativeModalPopupProps,
  NativeModalRootProps,
  NativeModalSide,
  NativeModalTitleProps,
  NativeModalTriggerProps,
} from "../../internal/NativeModal.js";

export type DrawerSide = NativeModalSide;
export type DrawerRootProps = NativeModalRootProps;
export type DrawerTriggerProps = NativeModalTriggerProps;
export interface DrawerPopupProps extends NativeModalPopupProps {
  side?: DrawerSide;
}
export type DrawerTitleProps = NativeModalTitleProps;
export type DrawerDescriptionProps = NativeModalDescriptionProps;
export type DrawerCloseProps = NativeModalCloseProps;
