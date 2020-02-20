import React, { useState } from 'react';
import { isSameDay, isAfter, isBefore, startOfMonth, Locale } from 'date-fns';
import { mergeModifiers, isSelectable } from './utils';
import useControllableState from './useControllableState';
import Calendar from './Calendar';
import {
  FocusType,
  DateChangeFn,
  MonthChangeFn,
  ModifiersObj,
  ModifierClassnameObj,
} from './types';

const { None, StartDate, EndDate } = FocusType;

type DateRangePickerCalendarProps = {
  locale: Locale;
  startDate?: Date;
  endDate?: Date;
  focus?: FocusType;
  month?: Date;
  onStartDateChange?: DateChangeFn;
  onEndDateChange?: DateChangeFn;
  onFocusChange?: (focus: FocusType) => void;
  onMonthChange?: MonthChangeFn;
  minimumDate?: Date;
  maximumDate?: Date;
  modifiers?: ModifiersObj;
  modifiersClassNames?: ModifierClassnameObj;
};
const DateRangePickerCalendar: React.FC<DateRangePickerCalendarProps> = ({
  locale,
  startDate,
  endDate,
  focus = FocusType.None,
  month: receivedMonth,
  onStartDateChange = () => {},
  onEndDateChange = () => {},
  onFocusChange = () => {},
  onMonthChange,
  minimumDate,
  maximumDate,
  modifiers: receivedModifiers,
  modifiersClassNames,
}) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [month, setMonth] = useControllableState(
    receivedMonth,
    onMonthChange,
    startOfMonth(startDate || endDate || new Date())
  );

  const displayedStartDate =
    focus === StartDate &&
    !startDate &&
    endDate &&
    hoveredDate &&
    !isSameDay(hoveredDate, endDate)
      ? hoveredDate
      : startDate;

  const displayedEndDate =
    focus === EndDate &&
    !endDate &&
    startDate &&
    hoveredDate &&
    !isSameDay(hoveredDate, startDate)
      ? hoveredDate
      : endDate;

  const isStartDate = (date: Date) =>
    !!displayedStartDate &&
    isSameDay(date, displayedStartDate) &&
    !!displayedEndDate &&
    isBefore(date, displayedEndDate);
  const isMiddleDate = (date: Date) =>
    !!displayedStartDate &&
    isAfter(date, displayedStartDate) &&
    !!displayedEndDate &&
    isBefore(date, displayedEndDate);
  const isEndDate = (date: Date) =>
    !!displayedStartDate &&
    isAfter(date, displayedStartDate) &&
    !!displayedEndDate &&
    isSameDay(date, displayedEndDate);

  const modifiers = mergeModifiers(
    {
      selected: date =>
        isSelectable(date, { minimumDate, maximumDate }) &&
        (isStartDate(date) ||
          isMiddleDate(date) ||
          isEndDate(date) ||
          (!!startDate && isSameDay(date, startDate)) ||
          (!!endDate && isSameDay(date, endDate))),
      selectedStart: isStartDate,
      selectedMiddle: isMiddleDate,
      selectedEnd: isEndDate,
      disabled: date =>
        (focus === StartDate && isEndDate(date)) ||
        (focus === EndDate && isStartDate(date)),
    },
    receivedModifiers
  );

  const handleSelectDate = (date: Date) => {
    if (focus === StartDate) {
      if (endDate && !isAfter(endDate, date)) {
        onEndDateChange(null);
      }

      onStartDateChange(date);
      onFocusChange(EndDate);
    } else if (focus === EndDate) {
      const invalidStartDate = startDate && !isBefore(startDate, date);

      if (invalidStartDate) {
        onStartDateChange(null);
      }

      onEndDateChange(date);
      onFocusChange(invalidStartDate ? StartDate : None);
    }
  };

  const handleHoverDate = (date: Date) => {
    setHoveredDate(date);
  };

  return (
    <Calendar
      locale={locale}
      month={month}
      onMonthChange={setMonth}
      onDayHover={handleHoverDate}
      onDayClick={handleSelectDate}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
    />
  );
};

export default DateRangePickerCalendar;
