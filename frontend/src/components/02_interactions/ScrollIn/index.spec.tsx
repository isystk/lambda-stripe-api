import React from 'react'
import renderer from 'react-test-renderer'
import ScrollIn from './index'

describe('ScrollIn', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<ScrollIn />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
