import { type Nullable } from "opc-types/lib/util/Nullable";

export interface ModalConfig {
  content: () => JSX.Element;
  customHeader?: () => JSX.Element;
  headerString?: string;
  onCloseModal?: () => void;
}

export interface ModalContextParams {
  showModal: (showDialogParams: ModalConfig) => void;
  hideModal: () => void;
}

export interface ModalContainerProps {
  onClose: () => void;
  open: boolean;
  content: () => JSX.Element;
  customHeader?: () => JSX.Element;
  headerString?: string;
  modalElement: Nullable<Element>;
}
