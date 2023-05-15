import React from 'react'
import renderer from 'react-test-renderer'
import ScrollTop from './index'
import '@testing-library/jest-dom/extend-expect'

describe('ScrollTop', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<ScrollTop name="sample" />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
