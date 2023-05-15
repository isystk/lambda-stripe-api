import React, { FC, useContext } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { connect } from '@/components/hoc'
import Logo from '@/components/01_atoms/Logo'
import Hamburger from '@/components/01_atoms/Hamburger'
import * as styles from './styles'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import MainService from '@/services/main'
import { Url } from '@/constants/url'

/** HeaderProps Props */
export type HeaderProps = WithChildren & { isMenuOpen; isPcSize; setMenuOpen }
/** Presenter Props */
export type PresenterProps = HeaderProps

/** Presenter Component */
const HeaderPresenter: FC<PresenterProps> = ({
  main,
  isMenuOpen,
  setMenuOpen,
}) => (
  <>
    <header
      className={`${styles.header} flex justify-between items-center px-4 py-4 sm:px-8 bg-gray-100 w-full`}
    >
      <Logo />
      <div className="flex pr-3 z-50 md:hidden">
        <Hamburger isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
      </div>
      <nav className="hidden sm:block">
        <ul className="flex gap-6">
          <li>
            <a href={Url.TOP}>ホーム</a>
          </li>
          <li>
            <a href="#">機能</a>
          </li>
          <li>
            <a href="#">料金</a>
          </li>
          <li>
            <a href="https://twitter.com/ise0615" target="_blank">お問い合わせ</a>
          </li>
        </ul>
      </nav>
    </header>
  </>
)

/** Container Component */
const HeaderContainer: React.FC<
  ContainerProps<HeaderProps, PresenterProps>
> = ({ presenter, children, ...props }) => {
  const main = useContext<MainService | null>(Context)
  if (!main) return <></>
  return presenter({
    children,
    main,
    ...props,
  })
}

export default connect<HeaderProps, PresenterProps>(
  'Header',
  HeaderPresenter,
  HeaderContainer
)
