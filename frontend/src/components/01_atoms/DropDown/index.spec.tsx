import React from 'react'
import { render } from '@testing-library/react'
import DropDown, { DropDownProps } from './index'

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
    const props: DropDownProps = {
      label: 'サンプル太郎',
      items: [
        { label: 'リンク1', link: 'http://link1' },
        { label: 'リンク2', link: 'http://link2' },
        { label: 'リンク3', link: 'http://link3' },
      ],
    }
    const { asFragment } = render(<DropDown {...props} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
