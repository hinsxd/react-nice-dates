import React from 'react';
import classNames from 'classnames';
import {
  addMonths,
  getYear,
  startOfMonth,
  subMonths,
  format,
  isSameMonth,
  Locale,
} from 'date-fns';

export type CalendarNavigationProps = {
  locale: Locale;
  month: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onMonthChange: (date: Date) => void;
};

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  locale,
  month,
  minimumDate,
  maximumDate,
  onMonthChange,
}) => {
  const handlePrevious = (event: React.MouseEvent | React.TouchEvent) => {
    onMonthChange(startOfMonth(subMonths(month, 1)));
    event.preventDefault();
  };

  const handleNext = (event: React.MouseEvent | React.TouchEvent) => {
    onMonthChange(startOfMonth(addMonths(month, 1)));
    event.preventDefault();
  };

  return (
    <div className="nice-dates-navigation">
      <a
        className={classNames('nice-dates-navigation_previous', {
          '-disabled': !!minimumDate && isSameMonth(month, minimumDate),
        })}
        onClick={handlePrevious}
        onTouchEnd={handlePrevious}
      />

      <span className="nice-dates-navigation_current">
        {format(
          month,
          getYear(month) === getYear(new Date()) ? 'MMMM' : 'MMMM yyyy',
          { locale }
        )}
      </span>

      <a
        className={classNames('nice-dates-navigation_next', {
          '-disabled': !!maximumDate && isSameMonth(month, maximumDate),
        })}
        onClick={handleNext}
        onTouchEnd={handleNext}
      />
    </div>
  );
};

export default CalendarNavigation;
