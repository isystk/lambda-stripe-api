import React from 'react'
import { render } from '@testing-library/react'
import Logo, { LogoProps } from './index'

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
    const props: LogoProps = {
      name: 'sample',
      link: '#',
    }
    const { asFragment } = render(<Logo {...props} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
