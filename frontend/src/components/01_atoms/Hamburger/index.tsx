import React, { FC } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { connect } from '@/components/hoc'
import * as styles from './styles'

/** HamburgerProps Props */
export type HamburgerProps = WithChildren & {
  isMenuOpen: boolean
  setMenuOpen: (isMenuOpen: boolean) => void
}
/** Presenter Props */
export type PresenterProps = HamburgerProps

/** Presenter Component */
const HamburgerPresenter: FC<PresenterProps> = ({
  isMenuOpen,
  setMenuOpen,
}) => (
  <>
    <button
      onClick={() => setMenuOpen(!isMenuOpen)}
      className={`space-y-2 ${styles.hamburger}`}
    >
      <div
        className={
          isMenuOpen
            ? 'w-6 h-0.5 bg-black translate-y-2.5 rotate-45'
            : 'w-6 h-0.5 bg-black'
        }
      />
      <div
        className={
          isMenuOpen ? 'w-6 h-0.5 bg-black -rotate-45' : 'w-6 h-0.5 bg-black'
        }
      />
      <div className={isMenuOpen ? 'opacity-0' : 'w-6 h-0.5 bg-black'} />
    </button>
  </>
)

/** Container Component */
const HamburgerContainer: React.FC<
  ContainerProps<HamburgerProps, PresenterProps>
> = ({ presenter, children, ...props }) => {
  return presenter({
    children,
    ...props,
  })
}

export default connect<HamburgerProps, PresenterProps>(
  'Hamburger',
  HamburgerPresenter,
  HamburgerContainer
)
