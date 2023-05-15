import React from 'react'
import renderer from 'react-test-renderer'
import Header from './index'

import { Context } from '@/components/05_layouts/HtmlSkeleton'
import MainService from '@/services/main'

describe('Header', () => {
  it('Match Snapshot', () => {
    const main = new MainService(() => ({}))

    const component = renderer.create(
      <Context.Provider value={main}>
        <Header
          isMenuOpen={false}
          setMenuOpen={(isOpen) => console.log(isOpen)}
        />
      </Context.Provider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
