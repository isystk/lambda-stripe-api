import React, { FC } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { connect } from '@/components/hoc'
import * as styles from './styles'

/** InputProps Props */
export type InputProps = WithChildren & {
  type: 'text' | 'password' | 'email'
  name: string
  placeholder: string
  register
  validate
  errors
}
/** Presenter Props */
export type PresenterProps = InputProps

/** Presenter Component */
const InputPresenter: FC<PresenterProps> = ({
  type,
  name,
  placeholder,
  register,
  validate,
  errors,
}) => (
  <>
    <input
      placeholder={placeholder}
      type={type}
      className={`${styles.input} p-3 bg-gray-200 rounded-md`}
      {...register(name, validate[name])}
    />
    {errors[name] && (
      <span className="pt-4 text-red-500">{errors[name].message}</span>
    )}
  </>
)

/** Container Component */
const InputContainer: React.FC<ContainerProps<InputProps, PresenterProps>> = ({
  presenter,
  children,
  ...props
}) => {
  return presenter({
    children,
    ...props,
  })
}

export default connect<InputProps, PresenterProps>(
  'Input',
  InputPresenter,
  InputContainer
)
