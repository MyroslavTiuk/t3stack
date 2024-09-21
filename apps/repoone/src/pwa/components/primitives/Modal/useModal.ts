import { useState, useEffect } from 'react';
import './Modal.module.scss';

export default function useModal() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add('opcalc-modal-open');
    } else {
      document.body.classList.remove('opcalc-modal-open');
    }
  }, [modalOpen]);

  return {
    setModalOpen,
    modalOpen,
  };
}
