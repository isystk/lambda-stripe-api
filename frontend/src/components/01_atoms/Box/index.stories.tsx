import { Meta, Story } from '@storybook/react'
import React from 'react'
import Box from './index'

export default {
  title: '01_atoms/Box',
  component: Box,
} as Meta

const Template: Story = (props) => {
  return <Box title="sample" />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
