import React from 'react'
import renderer from 'react-test-renderer'
import MainVisual from './index'
import { Context } from '@/components/05_layouts/HtmlSkeleton'

import MainService from '@/services/main'

describe('MainVisual', () => {
  it('Match Snapshot', () => {
    const main = new MainService(() => ({}))

    const component = renderer.create(
      <Context.Provider value={main}>
        <MainVisual />
      </Context.Provider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
