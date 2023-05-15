import { Meta, Story } from '@storybook/react'
import React from 'react'
import Modal from './index'
import { Container } from '@mui/material'

export default {
  title: '01_atoms/Modal',
  component: Modal,
} as Meta

const Template: Story = (props) => {
  return (
    <Modal isOpen={true}>
      <Container component="main">
        <div style={{ width: '300px' }}>Sample</div>
      </Container>
    </Modal>
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
