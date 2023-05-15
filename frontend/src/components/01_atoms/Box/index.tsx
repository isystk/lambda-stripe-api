import React, { FC } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { Box, Breadcrumbs, Typography } from '@mui/material'
import { connect } from '@/components/hoc'
import * as styles from './styles'
import Link from 'next/link'
import { Url } from '@/constants/url'

/** BoxProps Props */
export type BoxProps = WithChildren & { title }
/** Presenter Props */
export type PresenterProps = BoxProps

/** Presenter Component */
const BoxPresenter: FC<PresenterProps> = ({ children, title, ...props }) => (
  <>
    <Breadcrumbs aria-label="breadcrumb" className={styles.breadcrumbs}>
      <Link color="inherit" href={Url.TOP}>
        TOP
      </Link>
      <Typography component="span">{title}</Typography>
    </Breadcrumbs>
    <Box component="div" className={styles.box}>
      <Typography component="div" color="primary" className={styles.title}>
        {title}
      </Typography>
      {children}
    </Box>
  </>
)

/** Container Component */
const BoxContainer: React.FC<ContainerProps<BoxProps, PresenterProps>> = ({
  presenter,
  children,
  ...props
}) => {
  return presenter({
    children,
    ...props,
  })
}

export default connect<BoxProps, PresenterProps>(
  'Box',
  BoxPresenter,
  BoxContainer
)
