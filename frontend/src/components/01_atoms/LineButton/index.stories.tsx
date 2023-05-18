import { Meta, Story } from '@storybook/react'
import React from 'react'
import LineButton from './index'

export default {
  title: '01_atoms/LineButton',
  component: LineButton,
} as Meta

const Template: Story = (props) => {
  return (
    <LineButton
      link="#"
      label={t('Add me as a friend and ask me a question')}
    />
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
