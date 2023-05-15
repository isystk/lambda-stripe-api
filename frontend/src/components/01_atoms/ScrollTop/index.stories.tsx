import { Meta, Story } from '@storybook/react'
import React from 'react'
import ScrollTop from './index'

export default {
  title: '01_atoms/ScrollTop',
  component: ScrollTop,
} as Meta

const Template: Story = (props) => {
  return <ScrollTop isVisible={true} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
