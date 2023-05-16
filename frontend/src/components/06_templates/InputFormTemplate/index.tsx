import Circles from '@/components/02_interactions/Circles'
import React, { useEffect, FC, useState } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { connect } from '@/components/hoc'
import HtmlSkeleton, { Title } from '@/components/05_layouts/HtmlSkeleton'
import Header from '@/components/04_organisms/Header'
import SideMenu from '@/components/04_organisms/SideMenu'
import MainService from '@/services/main'

/** InputFormTemplateProps Props */
export type InputFormTemplateProps = WithChildren & {
  main: MainService
  title: string
}
/** Presenter Props */
export type PresenterProps = InputFormTemplateProps

/** Presenter Component */
const InputFormTemplatePresenter: FC<PresenterProps> = ({
  children,
  main,
  title,
  isMenuOpen,
  setMenuOpen,
  ...props
}) => (
  <HtmlSkeleton>
    <Title>{title}</Title>
    <Header isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
    <div className="flex items-center justify-center">
      <Circles>
        <div className="px-1 md:px-32 w-full">
          <div className="py-8">{children}</div>
        </div>
      </Circles>
    </div>
    <div className="md:hidden">
      <SideMenu isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
    </div>
  </HtmlSkeleton>
)

/** Container Component */
const InputFormTemplateContainer: React.FC<
  ContainerProps<InputFormTemplateProps, PresenterProps>
> = ({ presenter, children, ...props }) => {
  const [isMenuOpen, setMenuOpen] = useState(false)
  return presenter({
    children,
    isMenuOpen,
    setMenuOpen,
    ...props,
  })
}

export default connect<InputFormTemplateProps, PresenterProps>(
  'InputFormTemplate',
  InputFormTemplatePresenter,
  InputFormTemplateContainer
)
