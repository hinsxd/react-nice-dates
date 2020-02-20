import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { format, subMonths } from 'date-fns';
import { enGB as locale } from 'date-fns/locale';
import classNames from 'classnames';

import { DateRangePicker, FocusType } from '../src';

describe('DateRangePicker', () => {
  it('should render', () => {
    const { getAllByText } = render(
      <DateRangePicker locale={locale}>
        {({ startDateInputProps, endDateInputProps, focus }) => (
          <div className="date-range">
            <input
              aria-label={FocusType.StartDate}
              className={classNames({
                '-focused': focus === FocusType.StartDate,
              })}
              {...startDateInputProps}
            />
            <input
              aria-label={FocusType.EndDate}
              className={classNames({
                '-focused': focus === FocusType.EndDate,
              })}
              {...endDateInputProps}
            />
          </div>
        )}
      </DateRangePicker>
    );

    expect(getAllByText('1').length).toBeGreaterThan(0);
  });

  it('should open and close', () => {
    const { container, getAllByText, getByLabelText } = render(
      <DateRangePicker locale={locale}>
        {({ startDateInputProps, endDateInputProps, focus }) => (
          <div className="date-range">
            <input
              aria-label={FocusType.StartDate}
              className={classNames({
                '-focused': focus === FocusType.StartDate,
              })}
              {...startDateInputProps}
            />
            <input
              aria-label={FocusType.EndDate}
              className={classNames({
                '-focused': focus === FocusType.EndDate,
              })}
              {...endDateInputProps}
            />
          </div>
        )}
      </DateRangePicker>
    );

    const startDateInput = getByLabelText(FocusType.StartDate);
    const endDateInput = getByLabelText(FocusType.EndDate);
    const popover = container.querySelector('.nice-dates-popover');

    expect(popover).not.toHaveClass('-open');
    expect(startDateInput).not.toHaveClass('-focused');

    // Should open on focus
    fireEvent.focus(startDateInput);

    expect(popover).toHaveClass('-open');
    expect(startDateInput).toHaveClass('-focused');

    // Should close on outside click
    fireEvent.click(document);

    expect(popover).not.toHaveClass('-open');
    expect(startDateInput).not.toHaveClass('-focused');

    // Should close on date range selection
    fireEvent.focus(startDateInput);

    expect(popover).toHaveClass('-open');

    fireEvent.click(getAllByText('1')[0]);

    expect(popover).toHaveClass('-open');
    expect(endDateInput).toHaveClass('-focused');

    fireEvent.click(getAllByText('2')[0]);

    expect(popover).not.toHaveClass('-open');
  });

  it('should display pre-selected start date’s month on initial render', () => {
    const today = new Date();
    const pastDate = subMonths(today, 1);
    const monthName = format(pastDate, 'MMMM', { locale });

    const { getByText } = render(
      <DateRangePicker locale={locale} startDate={pastDate} endDate={today}>
        {() => {}}
      </DateRangePicker>
    );

    expect(getByText(monthName, { exact: false })).toBeInTheDocument();
  });

  it('should display pre-selected end date’s month on initial render', () => {
    const pastDate = subMonths(new Date(), 1);
    const monthName = format(pastDate, 'MMMM', { locale });

    const { getByText } = render(
      <DateRangePicker locale={locale} endDate={pastDate}>
        {() => {}}
      </DateRangePicker>
    );

    expect(getByText(monthName, { exact: false })).toBeInTheDocument();
  });
});
