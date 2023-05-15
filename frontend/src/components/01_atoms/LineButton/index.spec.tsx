import React from 'react'
import renderer from 'react-test-renderer'
import LineButton from './index'
import '@testing-library/jest-dom/extend-expect'

describe('LineButton', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<LineButton name="sample" />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
