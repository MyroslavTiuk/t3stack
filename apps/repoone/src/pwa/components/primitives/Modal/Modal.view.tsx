import Modal from "react-responsive-modal";
import React from "react";

import Icon from "../Icon";
import T from "../Typo";

import css from "./Modal.module.scss";
import { type ModalContainerProps } from "./Modal.props";
import Box from "../Box";

export default function ModalView({
  open,
  onClose,
  content: Content,
  customHeader: CustomHeader,
  headerString,
  modalElement,
}: ModalContainerProps) {
  const modalClassnames = {
    overlay: css.overlay,
    modal: css.modal,
  };

  if (!modalElement) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnEsc
      classNames={modalClassnames}
      closeIcon={
        <Icon
          icon="close"
          small
          className={css.closeIcon}
          ctnrClassName={css.closeIconCtnr}
        />
      }
      animationDuration={100}
      container={modalElement}
    >
      <Box className={css._inner}>
        {CustomHeader ? (
          <CustomHeader />
        ) : headerString ? (
          <T h5 className={css.header} mb={2}>
            {headerString}
          </T>
        ) : null}
        <div className={css.container}>{Content && <Content />}</div>
      </Box>
    </Modal>
  );
}
