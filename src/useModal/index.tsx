/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

Modal.defaultStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100vh",
    zIndex: 1000,
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "100%",
  },
};

type ModalReturnType = {
  openModal: () => void;
  closeModal: () => void;
  modalIsOpen: boolean;
  Modal: any;
};

export const useModal = (): ModalReturnType => {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return { openModal, closeModal, modalIsOpen, Modal };
};
