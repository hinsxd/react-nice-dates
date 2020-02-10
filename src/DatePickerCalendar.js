import React from 'react'
import { instanceOf, func, object, objectOf, string } from 'prop-types'
import { isSameDay, startOfMonth } from 'date-fns'
import { mergeModifiers, isSelectable } from './utils'
import useControllableState from './useControllableState'
import Calendar from './Calendar'

export default function DatePickerCalendar({
  locale,
  date: selectedDate,
  month: receivedMonth,
  onDateChange,
  onMonthChange,
  minimumDate,
  maximumDate,
  modifiers: receivedModifiers,
  modifiersClassNames
}) {
  const isSelected = date => isSameDay(date, selectedDate) && isSelectable(date, { minimumDate, maximumDate })
  const modifiers = mergeModifiers({ selected: isSelected, disabled: isSelected }, receivedModifiers)
  const [month, setMonth] = useControllableState(receivedMonth, onMonthChange, startOfMonth(selectedDate || new Date()))

  return (
    <Calendar
      locale={locale}
      month={month}
      onMonthChange={setMonth}
      onDayClick={onDateChange}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
    />
  )
}

DatePickerCalendar.propTypes = {
  locale: object.isRequired,
  date: instanceOf(Date),
  month: instanceOf(Date),
  onDateChange: func,
  onMonthChange: func,
  minimumDate: instanceOf(Date),
  maximumDate: instanceOf(Date),
  modifiers: objectOf(func),
  modifiersClassNames: objectOf(string)
}
