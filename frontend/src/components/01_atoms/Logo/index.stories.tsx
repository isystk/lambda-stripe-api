import { Meta, Story } from '@storybook/react'
import React from 'react'
import Logo from './index'

export default {
  title: '01_atoms/Logo',
  component: Logo,
} as Meta

const Template: Story = (props) => {
  return <Logo name="sample" />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
