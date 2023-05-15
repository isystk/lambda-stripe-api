import { Meta, Story } from '@storybook/react'
import React from 'react'
import Footer from './index'
import MainService from '@/services/main'
import { Context } from '@/components/05_layouts/HtmlSkeleton'

export default {
  title: '04_organisms/Footer',
  component: Footer,
} as Meta

const Template: Story = (props) => {
  const main = new MainService(() => ({}))

  return (
    <Context.Provider value={main}>
      <Footer />
    </Context.Provider>
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
