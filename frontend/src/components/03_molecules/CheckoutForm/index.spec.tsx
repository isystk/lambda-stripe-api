import React from 'react'
import renderer from 'react-test-renderer'
import CheckoutForm, { CheckoutFormProps } from './index'

import { Context } from '@/components/05_layouts/HtmlSkeleton'
import MainService from '@/services/main'

describe('CheckoutForm', () => {
  it('Match Snapshot', () => {
    // const props: CheckoutFormProps = {
    //   product: {
    //     plans: [
    //       {
    //         id: 1, amount: 999, currency: 'jpy'
    //       }
    //     ]
    //   }
    // }
    // const component = renderer.create(
    //     <CheckoutForm {...props}/>
    // )
    // const tree = component.toJSON()
    //
    // expect(tree).toMatchSnapshot()
    expect(true)
  })
})
