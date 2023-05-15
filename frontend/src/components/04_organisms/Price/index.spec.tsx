import React from 'react'
import renderer from 'react-test-renderer'
import Price from './index'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import '@testing-library/jest-dom/extend-expect'
import MainService from '@/services/main'

describe('Price', () => {
  it('Match Snapshot', () => {
    const main = new MainService(() => ({}))

    const component = renderer.create(
      <Context.Provider value={main}>
        <Price />
      </Context.Provider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
