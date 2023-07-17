import React, { FC } from 'react'
import { ContainerProps } from 'types'
import { connect } from '@/components/hoc'
import { Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ja from 'date-fns/locale/ja'
import { addYears, subYears } from 'date-fns'
import * as styles from './styles'
import { CustomCalendarHeader } from '@/components/01_atoms/DateInput/CustomCalendarHeader'

/** DateInputProps Props */
export type DateInputProps = {
  name
  placeholder: string
  control
  register
  validate
  errors
}
/** Presenter Props */
export type PresenterProps = DateInputProps

/** Presenter Component */
const DateInputPresenter: FC<PresenterProps> = ({
  name,
  placeholder,
  control,
  register,
  validate,
  errors = [],
}) => (
  <>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <DatePicker
          className={`${styles.dateInput} p-3 bg-gray-200 rounded-md`}
          placeholderText={placeholder}
          selected={value ? new Date(value) : null}
          onChange={(date) => {
            onChange(date ? date.toISOString().substring(0, 10) : null)
          }}
          {...register(name, validate[name])}
          data-testid="commentDateInput"
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          disabled={false}
          locale={ja}
          dateFormat="yyyy/MM/dd"
          autoComplete="off"
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <CustomCalendarHeader
              date={date}
              changeYear={changeYear}
              changeMonth={changeMonth}
              decreaseMonth={decreaseMonth}
              increaseMonth={increaseMonth}
              prevMonthButtonDisabled={prevMonthButtonDisabled}
              nextMonthButtonDisabled={nextMonthButtonDisabled}
            />
          )}
          minDate={subYears(new Date(), 10)}
          maxDate={addYears(new Date(), 10)}
        />
      )}
    />
    {errors[name] && (
      <span className="pt-4 text-red-500">{errors[name].message}</span>
    )}
  </>
)

/** Container Component */
const DateInputContainer: React.FC<
  ContainerProps<DateInputProps, PresenterProps>
> = ({ presenter, ...props }) => {
  return presenter({
    ...props,
  })
}

export default connect<DateInputProps, PresenterProps>(
  'DateInput',
  DateInputPresenter,
  DateInputContainer
)
