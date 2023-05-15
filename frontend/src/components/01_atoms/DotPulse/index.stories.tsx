import { Meta, Story } from '@storybook/react'
import React from 'react'
import DotPulse from './index'

export default {
  title: '01_atoms/DotPulse',
  component: DotPulse,
} as Meta

const Template: Story = (props) => {
  return (
    <DotPulse>
      <div
        style={{
          width: '100%',
          height: '600px',
          background: '#eee',
        }}
      ></div>
    </DotPulse>
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
