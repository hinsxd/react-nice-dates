import React from 'react';
import {
  Locale,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
} from 'date-fns';

export type CalendarWeekHeaderProps = {
  locale: Locale;
};
const CalendarWeekHeader: React.FC<CalendarWeekHeaderProps> = ({ locale }) => {
  const today = new Date();

  const weekDays = eachDayOfInterval({
    start: startOfWeek(today, { locale }),
    end: endOfWeek(today, { locale }),
  }).map(date => format(date, 'eee', { locale }));

  return (
    <div className="nice-dates-week-header">
      {weekDays.map(day => (
        <span key={day} className="nice-dates-week-header_day">
          {day}
        </span>
      ))}
    </div>
  );
};
export default CalendarWeekHeader;
