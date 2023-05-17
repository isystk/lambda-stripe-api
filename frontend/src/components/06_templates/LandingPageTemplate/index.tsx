import React, { FC, useEffect, useState } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { connect } from '@/components/hoc'
import HtmlSkeleton, { Title } from '@/components/05_layouts/HtmlSkeleton'
import Header from '@/components/04_organisms/Header'
import MainVisual from '@/components/04_organisms/MainVisual'
import Price from '@/components/04_organisms/Price'
import News from '@/components/04_organisms/News'
import Footer from '@/components/04_organisms/Footer'
import SideMenu from '@/components/04_organisms/SideMenu'
import MainService from '@/services/main'
import { frontMenuItems, frontFooterMenuItems } from '@/constants/menu'

/** LandingPageTemplateProps Props */
export type LandingPageTemplateProps = WithChildren & {
  main: MainService
}
/** Presenter Props */
export type PresenterProps = LandingPageTemplateProps

/** Presenter Component */
const LandingPageTemplatePresenter: FC<PresenterProps> = ({
  main,
  isMenuOpen,
  setMenuOpen,
  ...props
}) => (
  <HtmlSkeleton>
    <Title>商品名</Title>
    <Header
      isMenuOpen={isMenuOpen}
      setMenuOpen={setMenuOpen}
      menuItems={frontMenuItems}
    />
    <MainVisual />
    <Price />
    <div className="h-96"></div>
    <News />
    <Footer menuItems={frontFooterMenuItems} />
    <div className="md:hidden">
      <SideMenu
        isMenuOpen={isMenuOpen}
        setMenuOpen={setMenuOpen}
        menuItems={frontMenuItems}
      />
    </div>
  </HtmlSkeleton>
)

/** Container Component */
const LandingPageTemplateContainer: React.FC<
  ContainerProps<LandingPageTemplateProps, PresenterProps>
> = ({ presenter, children, main, ...props }) => {
  const [isMenuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('bg-image')
  }, [])

  return presenter({
    children,
    main,
    isMenuOpen,
    setMenuOpen,
    ...props,
  })
}
export default connect<LandingPageTemplateProps, PresenterProps>(
  'LandingPageTemplate',
  LandingPageTemplatePresenter,
  LandingPageTemplateContainer
)
