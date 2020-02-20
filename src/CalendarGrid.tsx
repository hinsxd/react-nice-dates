import React from 'react';
import {
  eachDayOfInterval,
  isSameMonth,
  lightFormat,
  startOfMonth,
} from 'date-fns';
import classNames from 'classnames';
import useGrid from './useGrid';
import { ORIGIN_BOTTOM, ORIGIN_TOP } from './constants';
import CalendarDay from './CalendarDay';
import { ModifiersObj, ModifierClassnameObj, MonthChangeFn } from './types';

export type CalendarGridProps = {
  locale: Locale;
  month: Date;
  modifiers?: ModifiersObj;
  modifiersClassNames?: ModifierClassnameObj;
  onMonthChange: MonthChangeFn;
  onDayHover?: Function;
  onDayClick?: Function;
  transitionDuration?: number;
};

const computeModifiers = (modifiers: ModifiersObj, date: Date) => {
  const computedModifiers: { [name: string]: boolean } = {};

  Object.keys(modifiers).map(key => {
    computedModifiers[key] = modifiers[key](date);
  });

  return computedModifiers;
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
  locale,
  month,
  modifiers = {},
  modifiersClassNames,
  onMonthChange,
  onDayHover,
  onDayClick,
  transitionDuration = 500,
}) => {
  const grid = useGrid({
    locale,
    month: startOfMonth(month),
    onMonthChange,
    transitionDuration,
  });
  const {
    startDate,
    endDate,
    cellHeight,
    containerElementRef,
    isWide,
    offset,
    origin,
    transition,
  } = grid;

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).map(date => {
    return (
      <CalendarDay
        date={date}
        height={cellHeight}
        key={lightFormat(date, 'yyyy-MM-dd')}
        locale={locale}
        modifiers={{
          ...computeModifiers(modifiers, date),
          outside: !isSameMonth(date, month),
          wide: isWide,
        }}
        modifiersClassNames={modifiersClassNames}
        onHover={onDayHover}
        onClick={onDayClick}
      />
    );
  });

  return (
    <div className="nice-dates-grid" style={{ height: cellHeight * 6 }}>
      <div
        className={classNames('nice-dates-grid_container', {
          '-moving': offset,
          '-origin-bottom': origin === ORIGIN_BOTTOM,
          '-origin-top': origin === ORIGIN_TOP,
          '-transition': transition,
        })}
        ref={containerElementRef}
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
          transitionDuration: `${transitionDuration}ms`,
        }}
      >
        {days}
      </div>
    </div>
  );
};

export default CalendarGrid;
