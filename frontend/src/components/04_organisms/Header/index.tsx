import React, { FC, useContext } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { connect } from '@/components/hoc'
import Logo from '@/components/01_atoms/Logo'
import Hamburger from '@/components/01_atoms/Hamburger'
import * as styles from './styles'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import MainService from '@/services/main'
import { useI18n } from '@/components/i18n'

/** HeaderProps Props */
export type HeaderProps = WithChildren & {
  isMenuOpen
  isPcSize
  setMenuOpen
  menuItems
}
/** Presenter Props */
export type PresenterProps = HeaderProps & {
  t
}

/** Presenter Component */
const HeaderPresenter: FC<PresenterProps> = ({
  t,
  isMenuOpen,
  setMenuOpen,
  menuItems = [],
}) => (
  <>
    <header
      className={`${styles.header} flex justify-between items-center h-16 px-4 py-4 sm:px-8 bg-main w-full`}
    >
      <Logo />
      <div
        className={`flex pr-3 z-50 md:hidden ${
          isMenuOpen ? 'fixed right-5' : ''
        }`}
      >
        <Hamburger isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
      </div>
      <nav className="hidden sm:block">
        <ul className="flex gap-6">
          {menuItems.map(({ label, href, target }, idx) => (
            <li key={idx}>
              <a href={href} target={target} rel={target ? 'noreferrer' : ''}>
                {t(label)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  </>
)

/** Container Component */
const HeaderContainer: React.FC<
  ContainerProps<HeaderProps, PresenterProps>
> = ({ presenter, children, ...props }) => {
  const { t } = useI18n('Common')
  return presenter({
    children,
    t,
    ...props,
  })
}

export default connect<HeaderProps, PresenterProps>(
  'Header',
  HeaderPresenter,
  HeaderContainer
)
