import React from 'react'
import { render } from '@testing-library/react'
import ErrorTemplate, { ErrorTemplateProps } from './index'

import { useRouter } from 'next/router'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))


describe('LandingPageTemplate', () => {
  it('Match Snapshot', () => {
    useRouter.mockImplementationOnce(() => ({
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
    }))
    const props: ErrorTemplateProps = { statusCode: 404 }
    const { asFragment } = render(<ErrorTemplate {...props} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
