import { Meta, Story } from '@storybook/react'
import React from 'react'
import CheckoutForm from './index'
import MainService from '@/services/main'
import { Context } from '@/components/05_layouts/HtmlSkeleton'

export default {
  title: '03_molecules/CheckoutForm',
  component: CheckoutForm,
} as Meta

const Template: Story = (props) => {
  const main = new MainService(() => ({}))

  return (
    <Context.Provider value={main}>
      {/*<CheckoutForm product={{plans: [{*/}
      {/*    id: 1, amount: 999, currency: 'jpy'*/}
      {/*  }]}}/>*/}
    </Context.Provider>
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
