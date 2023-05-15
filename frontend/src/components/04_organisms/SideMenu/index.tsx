import React, { FC, useContext } from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'
import { connect } from '@/components/hoc'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import MainService from '@/services/main'
import { Url } from '@/constants/url'

/** SideMenuProps Props */
export type SideMenuProps = WithChildren & { setMenuOpen; isMenuOpen }
/** Presenter Props */
export type PresenterProps = SideMenuProps & {
  main
  menu
  setMenuOpen
  isMenuOpen
}

/** Presenter Component */
const SideMenuPresenter: FC<PresenterProps> = ({
  main,
  menu,
  setMenuOpen,
  isMenuOpen,
  ...props
}) => (
  <>
    <div
      className={`${
        styles.sideMenu
      } fixed top-0 right-0 z-30 bg-white h-screen w-64 ${
        isMenuOpen ? styles.menuOpen : styles.menuClose
      }`}
    >
      <div className="mt-24"></div>
      <ul className="list-none">
        <li className="py-4">
          <a
            href={Url.Top}
            className="block text-gray-700 font-bold whitespace-nowrap px-4"
          >
            ホーム
          </a>
        </li>
        <li className="py-4">
          <a
            href={Url.Payment}
            className="block text-gray-600 hover:text-gray-700 whitespace-nowrap px-4"
          >
            料金
          </a>
        </li>
        <li className="py-4">
          <a
            href="https://twitter.com/ise0615"
            target="_blank"
            rel="noreferrer"
            className="block text-gray-600 hover:text-gray-700 whitespace-nowrap px-4"
          >
            お問い合わせ
          </a>
        </li>
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
  const main = useContext<MainService | null>(Context)
  if (!main) return <></>

  return presenter({
    children,
    main,
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
