import ErrorTemplate, {
  ErrorTemplateProps,
} from '@/components/06_templates/ErrorTemplate'
import { NextPage } from 'next'
import React from 'react'

const Error: NextPage = ({ statusCode }) => {
  const props: ErrorTemplateProps = { statusCode }
  return <ErrorTemplate {...props} />
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
