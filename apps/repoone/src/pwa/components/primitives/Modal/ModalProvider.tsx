import React, { useState, useCallback, createContext, useContext } from "react";
import Modal from "./Modal.view";
import { type ModalContextParams, type ModalConfig } from "./Modal.props";
import { type Nullable } from "opc-types/lib/util/Nullable";

interface Props {
  children: JSX.Element;
  modalElement: Nullable<Element>;
}

const ModalContext = createContext<ModalContextParams>({
  showModal: () => null,
  hideModal: () => null,
});

export default function ModalProvider({
  children,
  modalElement,
}: Props): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    // eslint-disable-next-line react/display-name
    content: () => <div />,
  });
  const showModal = useCallback(
    (newConfig: any) => {
      setOpen(true);
      setModalConfig(newConfig);
    },
    [setOpen, setModalConfig]
  );

  const hideModal = useCallback(() => {
    setOpen(false);
    if (modalConfig.onCloseModal) {
      modalConfig.onCloseModal();
    }
  }, [setOpen, modalConfig]);

  return (
    <ModalContext.Provider
      value={{
        hideModal,
        showModal,
      }}
    >
      <Modal
        open={open}
        onClose={hideModal}
        content={modalConfig.content}
        customHeader={modalConfig.customHeader}
        headerString={modalConfig.headerString}
        modalElement={modalElement}
      />
      {children}
    </ModalContext.Provider>
  );
}

export const useModalContext = (): ModalContextParams =>
  useContext(ModalContext);
