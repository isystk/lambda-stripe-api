import React from 'react'
import renderer from 'react-test-renderer'
import Box from './index'
import '@testing-library/jest-dom/extend-expect'

describe('Box', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<Box title="sample" />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
