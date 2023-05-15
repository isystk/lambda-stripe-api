import React from 'react'
import renderer from 'react-test-renderer'
import Loading from './index'
import '@testing-library/jest-dom/extend-expect'

describe('Loading', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<Loading />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
