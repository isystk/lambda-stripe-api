import React, { FC } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { connect } from '@/components/hoc'
import * as styles from './styles'

/** DotPulseProps Props */
export type DotPulseProps = WithChildren
/** Presenter Props */
export type PresenterProps = DotPulseProps

/** Presenter Component */
const DotPulsePresenter: FC<PresenterProps> = ({ children, ...props }) => (
  <>
    <div className={styles.dotPulse}></div>
  </>
)

/** Container Component */
const DotPulseContainer: React.FC<
  ContainerProps<DotPulseProps, PresenterProps>
> = ({ presenter, children, ...props }) => {
  return presenter({
    children,
    ...props,
  })
}

export default connect<DotPulseProps, PresenterProps>(
  'DotPulse',
  DotPulsePresenter,
  DotPulseContainer
)
