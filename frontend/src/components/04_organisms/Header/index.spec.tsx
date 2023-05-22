import React from 'react'
import { render } from '@testing-library/react'
import Header, { HeaderProps } from './index'

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
    const props: HeaderProps = {
      isMenuOpen: true,
      setMenuOpen: () => ({}),
      menuItems: [
        {
          label: 'Menu1',
          href: 'https://menu1',
        },
        {
          label: 'Menu2',
          href: 'https://menu2',
        },
        {
          label: 'Menu3',
          href: 'https://menu3',
          target: '_blank',
        },
      ],
    }
    const { asFragment } = render(<Header {...props} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
