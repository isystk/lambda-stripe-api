import React from 'react'
import renderer from 'react-test-renderer'
import ScrollIn from './index'
import '@testing-library/jest-dom/extend-expect'

describe('ScrollIn', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<ScrollIn />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
