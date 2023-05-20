import React from 'react'
import renderer from 'react-test-renderer'
import Header, { HeaderProps } from './index'

import { Context } from '@/components/05_layouts/HtmlSkeleton'
import MainService from '@/services/main'

describe('Header', () => {
  it('Match Snapshot', () => {
    const main = new MainService(() => ({}))
    const props: HeaderProps = {
      isMenuOpen: true,
      setMenuOpen: () => ({}),
      menuItems: [
        {
          label: 'Menu1',
          href: 'https://menu1',
        },
        {
          label: 'Menu2',
          href: 'https://menu2',
        },
        {
          label: 'Menu3',
          href: 'https://menu3',
          target: '_blank',
        },
      ],
    }
    const component = renderer.create(
      <Context.Provider value={main}>
        <Header {...props} />
      </Context.Provider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
