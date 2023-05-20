import React from 'react'
import renderer from 'react-test-renderer'
import LandingPageTemplate from './index'

describe('LandingPageTemplate', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(<LandingPageTemplate />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
