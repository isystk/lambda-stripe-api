import HtmlSkeleton, {
  HtmlSkeletonProps,
  Title,
} from '@/components/05_layouts/HtmlSkeleton'
import { connect } from '@/components/hoc'
import React, { useState } from 'react'
import { ContainerProps } from 'types'
import Header from '@/components/04_organisms/Header'
import SideMenu from '@/components/04_organisms/SideMenu'
import { frontMenuItems } from '@/constants/menu'

/** ErrorTemplate Props */
export type ErrorTemplateProps = Omit<HtmlSkeletonProps, 'children'> & {
  statusCode: number
}
/** Presenter Props */
export type PresenterProps = ErrorTemplateProps

/** Presenter Component */
const ErrorTemplatePresenter: React.FC<PresenterProps> = ({
  statusCode,
  isMenuOpen,
  setMenuOpen,
  ...props
}) => (
  <HtmlSkeleton>
    <Title>Page Not Found</Title>
    <Header
      isMenuOpen={isMenuOpen}
      setMenuOpen={setMenuOpen}
      menuItems={frontMenuItems}
    />
    <div className="flex items-center justify-center">
      <div className="p-3 md:p-32 w-full ">
        <div className="py-8">
          <p className="font-bold text-3xl md:mb-16 text-center">
            {statusCode} エラー
          </p>
          <div className="flex flex-wrap items-center p-8 md:mb-16">
            <div className="flex w-full justify-center items-center">
              <p className="text-2xl ">
                ページを正常に表示できませんでした。
                <br />
                ご入力内容等を確認の上で時間をおいて再度実行してください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
const ErrorTemplateContainer: React.FC<
  ContainerProps<ErrorTemplateProps, PresenterProps>
> = ({ presenter, ...props }) => {
  const [isMenuOpen, setMenuOpen] = useState(false)
  return presenter({
    isMenuOpen,
    setMenuOpen,
    ...props,
  })
}

/** ErrorTemplate */
export default connect<ErrorTemplateProps, PresenterProps>(
  'ErrorTemplate',
  ErrorTemplatePresenter,
  ErrorTemplateContainer
)
