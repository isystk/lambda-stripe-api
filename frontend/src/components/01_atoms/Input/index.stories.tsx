import { Meta, Story } from '@storybook/react'
import React from 'react'
import Input from './index'
import { useForm } from 'react-hook-form'

export default {
  title: '01_atoms/Input',
  component: Input,
} as Meta

type FormInputs = {
  email: string
}

const Template: Story = (props) => {
  const {
    register,
    formState: { errors },
  } = useForm<FormInputs>()
  const validate = {
    email: {
      required: 'メールアドレスを入力してください',
      pattern: {
        value: /[\w\-\\._]+@[\w\-\\._]+\.[A-Za-z]+/,
        message: 'メールアドレスを正しく入力してください',
      },
    },
  }
  return (
    <Input
      type="email"
      name="email"
      placeholder="メールアドレス"
      register={register}
      validate={validate}
      errors={errors}
    />
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {}
