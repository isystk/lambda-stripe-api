import React from 'react'
import renderer from 'react-test-renderer'
import Logo, { LogoProps } from './index'

describe('Logo', () => {
  it('Match Snapshot', () => {
    const props: LogoProps = {
      name: 'sample',
      link: '#',
    }
    const component = renderer.create(<Logo {...props} />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
