import { Meta, Story } from '@storybook/react'
import React from 'react'
import LineButton from './index'

export default {
  title: '01_atoms/LineButton',
  component: LineButton,
} as Meta

const Template: Story = (props) => {
  return <LineButton link="#" label="友達に追加して質問してみる" />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
