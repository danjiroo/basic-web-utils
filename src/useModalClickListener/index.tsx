/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, Ref } from 'react'

export interface ModalClickListenerProps {
  handleCloseModal?: () => void
}

const useModalClickListener = ({
  handleCloseModal,
}: ModalClickListenerProps): {
  modalRef: Ref<React.ElementType | any>
} => {
  const modalRef = useRef<React.ElementType>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // @ts-ignore
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleCloseModal?.()
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [])

  return { modalRef }
}

export default useModalClickListener
