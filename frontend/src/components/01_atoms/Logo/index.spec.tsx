import React from 'react'
import renderer from 'react-test-renderer'
import Logo from './index'

describe('Logo', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<Logo name="sample" />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
