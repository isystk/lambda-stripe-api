import React from 'react'
import { render } from '@testing-library/react'
import AdminTemplate, { AdminTemplateProps } from './index'
import MainService from '@/services/main'

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
    const main = new MainService(() => ({}))
    const props: AdminTemplateProps = { main, title: 'サンプル' }
    const { asFragment } = render(<AdminTemplate {...props} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
