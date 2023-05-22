import React from 'react'
import { render } from '@testing-library/react'
import LandingPageTemplate from './index'

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
    const { asFragment } = render(<LandingPageTemplate />)
    expect(asFragment()).toMatchSnapshot()
  })
})
