import React from 'react'
import renderer from 'react-test-renderer'
import Circles from './index'
import '@testing-library/jest-dom/extend-expect'

describe('Circles', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<Circles />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
