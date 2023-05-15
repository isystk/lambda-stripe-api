import React, { FC } from 'react'

import useAppRoot from '@/stores/useAppRoot'
import LandingPageTemplate, {
  type LandingPageTemplateProps,
} from '@/components/06_templates/LandingPageTemplate'

const Index: FC = () => {
  const main = useAppRoot()
  if (!main) return <></>
  const props: LandingPageTemplateProps = { main }
  return <LandingPageTemplate {...props} />
}

export default Index
