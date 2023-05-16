import React, { FC, useEffect, useRef, useState } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { connect } from '@/components/hoc'
import * as styles from './styles'

/** ScrollInProps Props */
export type ScrollInProps = WithChildren & { className?: string }
/** Presenter Props */
export type PresenterProps = ScrollInProps

/** Presenter Component */
const ScrollInPresenter: FC<PresenterProps> = ({
  children,
  className,
  myRef,
  isVisible,
  ...props
}) => (
  <div
    ref={myRef}
    className={`${className} ${isVisible ? styles.scrollin : styles.fadeIn}`}
  >
    {children}
  </div>
)

/** Container Component */
const ScrollInContainer: React.FC<
  ContainerProps<ScrollInProps, PresenterProps>
> = ({ presenter, children, ...props }) => {
  const myRef = useRef(null)
  const [scroll, setScroll] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const onScroll = (): void => {
    setScroll(window.scrollY || document.documentElement.scrollTop)
    setWindowHeight(window.innerHeight)
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
  }, [])

  if (
    !isVisible &&
    myRef.current &&
    scroll > myRef.current.offsetTop - windowHeight + 100
  ) {
    console.log(scroll, myRef.current.offsetTop)
    setIsVisible(true)
    // 表示が完了したらスクロールイベントを削除
    window.removeEventListener('scroll', onScroll)
  }

  return presenter({
    children,
    myRef,
    isVisible,
    ...props,
  })
}

export default connect<ScrollInProps, PresenterProps>(
  'ScrollIn',
  ScrollInPresenter,
  ScrollInContainer
)
