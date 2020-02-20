import React from 'react';
import { ModifiersObj, ModifierClassnameObj, MonthChangeFn } from './types';

import { startOfMonth, Locale } from 'date-fns';
import { isSelectable, mergeModifiers } from './utils';
import useControllableState from './useControllableState';
import CalendarNavigation from './CalendarNavigation';
import CalendarWeekHeader from './CalendarWeekHeader';
import CalendarGrid from './CalendarGrid';

export type CalendarProps = {
  locale: Locale;
  minimumDate?: Date;
  maximumDate?: Date;
  modifiers?: ModifiersObj;
  modifiersClassNames?: ModifierClassnameObj;
  month?: Date;
  onMonthChange?: MonthChangeFn;
  onDayHover?: Function;
  onDayClick?: Function;
};

const Calendar: React.FC<CalendarProps> = ({
  locale,
  month: receivedMonth,
  modifiers: receivedModifiers,
  modifiersClassNames,
  minimumDate,
  maximumDate,
  onMonthChange,
  onDayHover,
  onDayClick,
}) => {
  const [month, setMonth] = useControllableState(
    receivedMonth,
    onMonthChange,
    startOfMonth(new Date())
  );

  const modifiers = mergeModifiers(
    {
      disabled: date => !isSelectable(date, { minimumDate, maximumDate }),
    },
    receivedModifiers
  );

  return (
    <div>
      <CalendarNavigation
        locale={locale}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        month={month}
        onMonthChange={setMonth}
      />

      <CalendarWeekHeader locale={locale} />

      <CalendarGrid
        locale={locale}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        month={month}
        onMonthChange={setMonth}
        onDayHover={onDayHover}
        onDayClick={onDayClick}
      />
    </div>
  );
};

export default Calendar;
