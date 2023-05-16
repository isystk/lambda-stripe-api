import React from 'react'
import renderer from 'react-test-renderer'
import Modal from './index'

describe('Modal', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<Modal isOpen={true} />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
