import { Meta, Story } from '@storybook/react'
import React from 'react'
import CheckoutForm, { CheckoutFormProps } from './index'

export default {
  title: '03_molecules/CheckoutForm',
  component: CheckoutForm,
} as Meta

const Template: Story = () => {
  // const props: CheckoutFormProps = {
  //   product: {
  //     plans: [
  //       {
  //         id: 1, amount: 999, currency: 'jpy'
  //       }
  //     ]
  //   }
  // }
  // return (
  //     <CheckoutForm {...props} />
  // )
  return <></>
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
