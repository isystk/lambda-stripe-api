import React from 'react'
import renderer from 'react-test-renderer'
import Hamburger from './index'

describe('Hamburger', () => {
  it('Match Snapshot', () => {
    const component = renderer.create(
      <Hamburger
        isMenuOpen={false}
        setMenuOpen={(isMenuOpen) => console.log(isMenuOpen)}
      />
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
