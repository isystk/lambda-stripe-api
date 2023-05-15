import { Meta, Story } from '@storybook/react'
import React from 'react'
import LandingPageTemplate, { LandingPageTemplateProps } from './index'
import MainService from '@/services/main'

export default {
  title: '06_templates/LandingPageTemplate',
  component: LandingPageTemplate,
} as Meta

const Template: Story = () => {
  const main = new MainService(() => ({}))
  const props: LandingPageTemplateProps = { main }
  return <LandingPageTemplate {...props} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
