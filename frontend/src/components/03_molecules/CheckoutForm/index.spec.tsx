import React from 'react'
import renderer from 'react-test-renderer'
import CheckoutForm from './index'
import '@testing-library/jest-dom/extend-expect'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import MainService from '@/services/main'

describe('CheckoutForm', () => {
  it('Match Snapshot', () => {
    const main = new MainService(() => ({}))

    const component = renderer.create(
      <Context.Provider value={main}>
        {/*<CheckoutForm product={{plans: [{*/}
        {/*  id: 1, amount: 999, currency: 'jpy' */}
        {/*  }]}}/>*/}
      </Context.Provider>
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
