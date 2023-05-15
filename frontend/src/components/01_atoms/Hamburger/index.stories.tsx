import { Meta, Story } from '@storybook/react'
import React from 'react'
import Hamburger from './index'

export default {
  title: '01_atoms/Hamburger',
  component: Hamburger,
} as Meta

const Template: Story = ({ isMenuOpen }) => {
  return (
    <Hamburger
      isMenuOpen={isMenuOpen}
      setMenuOpen={(isMenuOpen) => console.log(isMenuOpen)}
    />
  )
}

export const Close = Template.bind()
Close.storyName = 'Close'
Close.args = { isMenuOpen: false }
export const Open = Template.bind()
Open.storyName = 'Open'
Open.args = { isMenuOpen: true }
