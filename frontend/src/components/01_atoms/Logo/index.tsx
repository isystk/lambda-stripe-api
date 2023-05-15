import React, { FC } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { connect } from '@/components/hoc'
import * as styles from './styles'
import { APP_NAME } from '@/constants'
import { Url } from '@/constants/url'

/** LogoProps Props */
export type LogoProps = WithChildren & {
  name?: string
}
/** Presenter Props */
export type PresenterProps = LogoProps

/** Presenter Component */
const LogoPresenter: FC<PresenterProps> = ({ name = APP_NAME }) => (
  <>
    <a href={Url.Top} className={`${styles.logo} w-20 md:w-40`}>
      <img src="/images/logo.png" alt={name}></img>
    </a>
  </>
)

/** Container Component */
const LogoContainer: React.FC<ContainerProps<LogoProps, PresenterProps>> = ({
  presenter,
  children,
  ...props
}) => {
  return presenter({
    children,
    ...props,
  })
}

export default connect<LogoProps, PresenterProps>(
  'Logo',
  LogoPresenter,
  LogoContainer
)
