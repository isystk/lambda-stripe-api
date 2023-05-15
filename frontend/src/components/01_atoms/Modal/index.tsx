import React, { FC, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import CloseIcon from '@mui/icons-material/Close'
import { Fab } from '@mui/material'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'
import { connect } from '@/components/hoc'

/** ModalProps Props */
export type ModalProps = WithChildren & { isOpen; hideCloseBtn; handleClose }
/** Presenter Props */
export type PresenterProps = ModalProps & { onClose; Portal }

/** Presenter Component */
const ModalPresenter: FC<PresenterProps> = ({
  children,
  isOpen,
  hideCloseBtn,
  handleClose,
  onClose,
  Portal,
  ...props
}) => (
  <>
    <Portal>
      {isOpen && (
        <>
          <div className={styles.overlayBackground}></div>
          <div className={styles.overlay}>
            {!hideCloseBtn && (
              <Fab color="default" aria-label="add" className={styles.closeBtn}>
                <CloseIcon onClick={onClose}>
                  <span aria-hidden="true">&times;</span>
                </CloseIcon>
              </Fab>
            )}
            <div className={styles.wrap}>{children}</div>
          </div>
        </>
      )}
    </Portal>
  </>
)

/** Container Component */
const ModalContainer: React.FC<ContainerProps<ModalProps, PresenterProps>> = ({
  presenter,
  children,
  handleClose,
  ...props
}) => {
  const onClose = (e) => {
    e.preventDefault()
    handleClose()
  }

  const Portal: FC = ({ children }) => {
    const ref = useRef<HTMLElement>()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      const current = document.querySelector<HTMLElement>('body')
      if (current) {
        ref.current = current
      }
      setMounted(true)
    }, [])

    return mounted
      ? ReactDOM.createPortal(
          <>{children}</>,
          ref.current ? ref.current : new Element()
        )
      : null
  }
  return presenter({ children, onClose, Portal, ...props })
}

export default connect<ModalProps, PresenterProps>(
  'Modal',
  ModalPresenter,
  ModalContainer
)
