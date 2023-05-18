import React, { FC, useContext } from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'
import { connect } from '@/components/hoc'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import MainService from '@/services/main'
import { useI18n } from '@/components/i18n'

/** SideMenuProps Props */
export type SideMenuProps = WithChildren & {
  setMenuOpen
  isMenuOpen
  menuItems
}
/** Presenter Props */
export type PresenterProps = SideMenuProps & {
  menu
  setMenuOpen
  isMenuOpen
}

/** Presenter Component */
const SideMenuPresenter: FC<PresenterProps> = ({
  t,
  menu,
  setMenuOpen,
  isMenuOpen,
  menuItems = [],
  ...props
}) => (
  <>
    <div
      className={`${
        styles.sideMenu
      } fixed top-0 right-0 z-30 bg-base h-screen w-64 ${
        isMenuOpen ? styles.menuOpen : styles.menuClose
      }`}
    >
      <div className="mt-24"></div>
      <ul className="list-none">
        {menuItems.map(({ label, href, target }, idx) => (
          <li className="py-4" key={idx}>
            <a
              href={href}
              target={target}
              rel={target ? 'noreferrer' : ''}
              className="block text-gray-700 font-bold whitespace-nowrap px-4"
            >
              {t(label)}
            </a>
          </li>
        ))}
      </ul>
    </div>
    <div
      className={`${
        isMenuOpen ? 'block' : 'hidden'
      } z-20 bg-black opacity-50 fixed top-0 w-full h-screen`}
      onClick={() => setMenuOpen(!isMenuOpen)}
    ></div>
  </>
)

/** Container Component */
const SideMenuContainer: React.FC<
  ContainerProps<SideMenuProps, PresenterProps>
> = ({ presenter, children, setMenuOpen, isMenuOpen, ...props }) => {
  const { t } = useI18n('Common')

  return presenter({
    children,
    t,
    setMenuOpen,
    isMenuOpen,
    ...props,
  })
}

export default connect<SideMenuProps, PresenterProps>(
  'SideMenu',
  SideMenuPresenter,
  SideMenuContainer
)
