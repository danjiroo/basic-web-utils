declare type ModalReturnType = {
    openModal: () => void;
    closeModal: () => void;
    modalIsOpen: boolean;
    Modal: any;
};
export declare const useModal: () => ModalReturnType;
export {};
