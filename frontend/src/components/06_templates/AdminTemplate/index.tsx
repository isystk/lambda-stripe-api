import Circles from '@/components/02_interactions/Circles'
import React, { FC, useEffect } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { connect } from '@/components/hoc'
import HtmlSkeleton, { Title } from '@/components/05_layouts/HtmlSkeleton'
import MainService from '@/services/main'
import { adminMenuItems } from '@/constants/menu'
import Logo from '@/components/01_atoms/Logo'
import { Url } from '@/constants/url'
import useAppRoot from '@/stores/useAppRoot'
import axios from '@/utils/axios'
import { Api } from '@/constants/api'

/** AdminTemplateProps Props */
export type AdminTemplateProps = WithChildren & {
  main: MainService
  title: string
}
/** Presenter Props */
export type PresenterProps = AdminTemplateProps & {
  logout
}

/** Presenter Component */
const AdminTemplatePresenter: FC<PresenterProps> = ({
  children,
  main,
  title,
  logout,
  ...props
}) => (
  <HtmlSkeleton>
    <Title>{title}</Title>
    <div className="h-screen">
      <div className="h-16 bg-base p-4 md:p-0 flex">
        <Logo link={Url.AdminHome} />
        <div className={`ml-auto p-3 md:p-6 ${main.user ? '' : 'hidden'}`}>
          <a href="#" onClick={() => logout()}>
            ログアウト
          </a>
        </div>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-2 bg-base hidden md:block">
          <div className="p-4 border-t">
            <ul className="list-none">
              {adminMenuItems.map(({ label, href, target }, idx) => (
                <li className="my-6" key={idx}>
                  <a
                    href={href}
                    target={target}
                    rel={target ? 'noreferrer' : ''}
                    className="break-words whitespace-pre-wrap text-gray-700 font-bold whitespace-nowrap"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-12 md:col-span-10">
          <div className="h-screen">
            <div className="flex items-center justify-center">
              <Circles>
                <div className="p-1 md:p-8 w-full">{children}</div>
              </Circles>
            </div>
          </div>
        </div>
      </div>
    </div>
  </HtmlSkeleton>
)

/** Container Component */
const AdminTemplateContainer: React.FC<
  ContainerProps<AdminTemplateProps, PresenterProps>
> = ({ presenter, main, children, ...props }) => {
  const logout = async () => {
    await main.logout()
    location.reload()
  }

  return presenter({
    children,
    main,
    logout,
    ...props,
  })
}

export default connect<AdminTemplateProps, PresenterProps>(
  'AdminTemplate',
  AdminTemplatePresenter,
  AdminTemplateContainer
)