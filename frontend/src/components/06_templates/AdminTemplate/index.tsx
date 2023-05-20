import Circles from '@/components/02_interactions/Circles'
import React, { FC } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { connect } from '@/components/hoc'
import HtmlSkeleton, {
  NoIndex,
  Title,
} from '@/components/05_layouts/HtmlSkeleton'
import MainService from '@/services/main'
import { adminMenuItems } from '@/constants/menu'
import Logo from '@/components/01_atoms/Logo'
import { Url } from '@/constants/url'
import { useI18n } from '@/components/i18n'
import { useRouter } from 'next/router'
import Breadcrumb, {
  type BreadcrumbItem,
} from '@/components/01_atoms/Breadcrumb'
import DropDown from '@/components/01_atoms/DropDown'

/** AdminTemplateProps Props */
export type AdminTemplateProps = WithChildren & {
  main: MainService
  title: string
  breadcrumb?: BreadcrumbItem[]
}
/** Presenter Props */
export type PresenterProps = AdminTemplateProps & {
  t
  logout
  router
}

/** Presenter Component */
const AdminTemplatePresenter: FC<PresenterProps> = ({
  children,
  main,
  t,
  title,
  breadcrumb = [],
  logout,
  router,
  ...props
}) => (
  <HtmlSkeleton>
    <Title>{`${title}－Admin`}</Title>
    <NoIndex />
    <div className="h-screen">
      <div className="h-16 bg-base p-4 md:p-0 flex">
        <Logo link={Url.AdminHome} />
        {main.user && (
          <div className="ml-auto p-3 md:p-6">
            <DropDown
              label={main.user.userName}
              items={[{ label: 'ログアウト', link: () => logout() }]}
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-2 bg-base hidden md:block">
          <div className="p-4 border-t">
            <ul className="list-none">
              {adminMenuItems.map(({ label, href, target }, idx) => (
                <li className="my-6" key={idx}>
                  <a
                    href="#"
                    target={target}
                    rel={target ? 'noreferrer' : ''}
                    className="break-words whitespace-pre-wrap text-gray-700 font-bold whitespace-nowrap"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(href)
                    }}
                  >
                    {t(label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-12 md:col-span-10">
          <div
            className="flex items-center justify-center"
            style={{ height: 'calc(100vh - 4rem)' }}
          >
            <Circles>
              {main.user && <Breadcrumb items={breadcrumb} />}
              <div className="py-8 md:p-8 w-full">{children}</div>
            </Circles>
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
  const router = useRouter()
  const { t } = useI18n('Admin')
  const logout = async () => {
    await main.logout()
    location.reload()
  }

  return presenter({
    children,
    main,
    t,
    logout,
    router,
    ...props,
  })
}

export default connect<AdminTemplateProps, PresenterProps>(
  'AdminTemplate',
  AdminTemplatePresenter,
  AdminTemplateContainer
)
