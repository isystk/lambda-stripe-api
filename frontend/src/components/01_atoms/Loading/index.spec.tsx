import React from 'react'
import renderer from 'react-test-renderer'
import Loading from './index'

describe('Loading', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<Loading />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
