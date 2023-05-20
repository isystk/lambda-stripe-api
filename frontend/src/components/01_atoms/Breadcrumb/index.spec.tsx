import React from 'react'
import { render } from '@testing-library/react'
import Breadcrumb, { BreadcrumbProps } from './index'

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
    const props: BreadcrumbProps = {
      items: [
        { label: 'リンク1', link: 'http://link1' },
        { label: 'リンク2', link: 'http://link2' },
        { label: 'リンク3' },
      ],
    }
    const { asFragment } = render(<Breadcrumb {...props} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
