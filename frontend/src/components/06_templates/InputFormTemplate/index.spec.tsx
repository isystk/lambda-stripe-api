import React from 'react'
import { render } from '@testing-library/react'
import InputFormTemplate, { InputFormTemplateProps } from './index'

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
    const props: InputFormTemplateProps = { title: 'サンプル' }
    const { asFragment } = render(<InputFormTemplate {...props} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
