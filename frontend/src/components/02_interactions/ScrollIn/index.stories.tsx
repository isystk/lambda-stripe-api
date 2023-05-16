import { Meta, Story } from '@storybook/react'
import React from 'react'
import ScrollIn from './index'

export default {
  title: '02_interactions/ScrollIn',
  component: ScrollIn,
} as Meta

const Template: Story = (props) => {
  return (
    <ScrollIn>
      <div
        style={{
          height: '600px',
        }}
      ></div>
    </ScrollIn>
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
