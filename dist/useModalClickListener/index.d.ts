import { Ref } from 'react';
export interface ModalClickListenerProps {
    handleCloseModal?: () => void;
}
declare const useModalClickListener: ({ handleCloseModal, }: ModalClickListenerProps) => {
    modalRef: Ref<React.ElementType | any>;
};
export default useModalClickListener;
