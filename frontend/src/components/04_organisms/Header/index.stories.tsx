import { Meta, Story } from '@storybook/react'
import { Context } from '@/components/05_layouts/HtmlSkeleton'
import React from 'react'
import Header from './index'
import MainService from '@/services/main'

export default {
  title: '04_organisms/Header',
  component: Header,
} as Meta

const Template: Story = ({ name = '', roomId = '' }) => {
  const main = new MainService(() => ({}))

  return (
    <Context.Provider value={main}>
      <Header
        isMenuOpen={false}
        setMenuOpen={(isOpen) => console.log(isOpen)}
      />
    </Context.Provider>
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
