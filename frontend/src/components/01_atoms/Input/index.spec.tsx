import React from 'react'
import renderer from 'react-test-renderer'
import Input from './index'

describe('Input', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<Input name="sample" />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
