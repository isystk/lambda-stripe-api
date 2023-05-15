import { Meta, Story } from '@storybook/react'
import React from 'react'
import Loading from './index'

export default {
  title: '01_atoms/Loading',
  component: Loading,
} as Meta

const Template: Story = (props) => {
  return <Loading loading={true} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
