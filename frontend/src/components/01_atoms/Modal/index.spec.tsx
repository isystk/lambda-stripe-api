import React from 'react'
import renderer from 'react-test-renderer'
import Modal from './index'
import '@testing-library/jest-dom/extend-expect'

describe('Modal', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<Modal isOpen={true} />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
