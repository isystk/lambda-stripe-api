import React from 'react'
import renderer from 'react-test-renderer'
import SideMenu from './index'

import { Context } from '@/components/05_layouts/HtmlSkeleton'
import MainService from '@/services/main'

describe('SideMenu', () => {
  it('Match Snapshot', () => {
    const main = new MainService(() => ({}))

    const component = renderer.create(
      <Context.Provider value={main}>
        <SideMenu
          isMenuOpen={false}
          setMenuOpen={(isOpen) => console.log(isOpen)}
        />
      </Context.Provider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
