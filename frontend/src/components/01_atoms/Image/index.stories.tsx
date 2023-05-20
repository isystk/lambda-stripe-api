import { Meta, Story } from '@storybook/react'
import React from 'react'
import Image from './index'

export default {
  title: '01_atoms/Image',
  component: Image,
} as Meta

const Template: Story = (props) => {
  return (
    <div className="w-64 rounded-lg overflow-hidden">
      <Image
        src="/images/dummy_480x320.png"
        className="zoom"
        alt="dummy"
        zoom={true}
      />
    </div>
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
