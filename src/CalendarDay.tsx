import React from 'react';

import { getDate, format, isToday, Locale } from 'date-fns';
import classNames from 'classnames';
import {
  DefaultModifierClassnameObj,
  CalculatedModifierObj,
  ModifierClassnameObj,
} from './types';

const defaultModifiersClassNames: DefaultModifierClassnameObj = {
  today: '-today',
  outside: '-outside',
  wide: '-wide',
  disabled: '-disabled',
  selected: '-selected',
  selectedStart: '-selected-start',
  selectedMiddle: '-selected-middle',
  selectedEnd: '-selected-end',
};

type CalendarDayProps = {
  date: Date;
  height: number;
  locale: Locale;
  modifiers?: CalculatedModifierObj;
  modifiersClassNames?: ModifierClassnameObj;
  onHover?: Function;
  onClick?: Function;
};

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  height,
  locale,
  modifiers: receivedModifiers = {},
  modifiersClassNames: receivedModifiersClassNames,
  onClick = () => {},
  onHover = () => {},
}) => {
  const dayOfMonth = getDate(date);
  let dayClassNames: CalculatedModifierObj = {};
  const modifiers: CalculatedModifierObj = {
    today: isToday(date),
    ...receivedModifiers,
  };
  const modifiersClassNames: ModifierClassnameObj = {
    ...defaultModifiersClassNames,
    ...receivedModifiersClassNames,
  };

  Object.entries(modifiers).forEach(([name, value]) => {
    const classname = modifiersClassNames[name];
    if (!!classname) {
      dayClassNames[classname] = value;
    }
  });

  const handleClick = (event: any) => {
    onClick(date);
    event.preventDefault();
  };

  const handleMouseEnter = () => {
    onHover(date);
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  return (
    <span
      className={classNames('nice-dates-day', dayClassNames)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleClick}
      style={{ height }}
    >
      {dayOfMonth === 1 && (
        <span className="nice-dates-day_month">
          {format(date, 'MMMM', { locale }).substring(0, 3)}
        </span>
      )}
      <span className="nice-dates-day_date">{dayOfMonth}</span>
    </span>
  );
};

export default CalendarDay;
