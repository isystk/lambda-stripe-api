import { Meta, Story } from '@storybook/react'
import React from 'react'
import ErrorTemplate, { ErrorTemplateProps } from './index'
import MainService from '@/services/main'

export default {
  title: '06_templates/ErrorTemplate',
  component: ErrorTemplate,
} as Meta

const Template: Story = () => {
  const main = new MainService(() => ({}))
  const props: ErrorTemplateProps = { main, statusCode: '404' }
  return <ErrorTemplate {...props} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
