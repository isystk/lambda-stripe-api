import { Meta, Story } from '@storybook/react'
import React from 'react'
import Input from './index'

export default {
  title: '01_atoms/Input',
  component: Input,
} as Meta

const Template: Story = (props) => {
  return <Input type="email" name="email" placeholder="メールアドレス" />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
