import React from 'react';
import { isSameDay, startOfMonth, Locale } from 'date-fns';
import { mergeModifiers, isSelectable } from './utils';
import useControllableState from './useControllableState';
import Calendar from './Calendar';
import {
  ModifiersObj,
  ModifierClassnameObj,
  DateChangeFn,
  MonthChangeFn,
} from './types';
export type DatePickerCalendarProps = {
  locale: Locale;
  date?: Date;
  month?: Date;
  onDateChange?: DateChangeFn;
  onMonthChange?: MonthChangeFn;
  minimumDate?: Date;
  maximumDate?: Date;
  modifiers?: ModifiersObj;
  modifiersClassNames?: ModifierClassnameObj;
};
const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
  locale,
  date: selectedDate,
  month: receivedMonth,
  onDateChange,
  onMonthChange,
  minimumDate,
  maximumDate,
  modifiers: receivedModifiers,
  modifiersClassNames,
}) => {
  const isSelected = (date: Date): boolean =>
    !!selectedDate &&
    isSameDay(date, selectedDate) &&
    isSelectable(date, { minimumDate, maximumDate });

  const modifiers: ModifiersObj = mergeModifiers(
    { selected: isSelected, disabled: isSelected },
    receivedModifiers
  );
  const [month, setMonth] = useControllableState(
    receivedMonth,
    onMonthChange,
    startOfMonth(selectedDate || new Date())
  );

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
  );
};

export default DatePickerCalendar;
