import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { addDays, format, startOfMonth, subMonths } from 'date-fns';
import { enGB as locale } from 'date-fns/locale';
import { FocusType } from '../src/types';
import DateRangePickerCalendar from '../src/DateRangePickerCalendar';

describe('DateRangePickerCalendar', () => {
  it('should render', () => {
    const { getAllByText } = render(
      <DateRangePickerCalendar
        locale={locale}
        onStartDateChange={() => {}}
        onEndDateChange={() => {}}
        onFocusChange={() => {}}
      />
    );

    expect(getAllByText('1').length).toBeGreaterThan(0);
  });

  it('should call callbacks on date selection', () => {
    const handleStartDateChange = jest.fn();
    const handleEndDateChange = jest.fn();
    const handleFocusChange = jest.fn();

    const { getAllByText, rerender } = render(
      <DateRangePickerCalendar
        locale={locale}
        focus={FocusType.StartDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onFocusChange={handleFocusChange}
      />
    );

    fireEvent.click(getAllByText('1')[0]);

    expect(handleStartDateChange).toHaveBeenCalledTimes(1);
    expect(handleEndDateChange).toHaveBeenCalledTimes(0);
    expect(handleFocusChange).toHaveBeenCalledWith(FocusType.EndDate);

    rerender(
      <DateRangePickerCalendar
        locale={locale}
        focus={FocusType.EndDate}
        startDate={startOfMonth(new Date())}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onFocusChange={handleFocusChange}
      />
    );

    fireEvent.click(getAllByText('2')[0]);

    expect(handleStartDateChange).toHaveBeenCalledTimes(1);
    expect(handleEndDateChange).toHaveBeenCalledTimes(1);
    expect(handleFocusChange).toHaveBeenCalledWith(FocusType.None);
  });

  it('should display selected date range', () => {
    const startDate = startOfMonth(new Date());
    const endDate = addDays(startDate, 2);

    const { container, getAllByText, rerender } = render(
      <DateRangePickerCalendar locale={locale} startDate={startDate} />
    );

    expect(getAllByText('1')[0].parentElement).toHaveClass('-selected');
    expect(container.querySelectorAll('.-selected').length).toBe(1);

    rerender(
      <DateRangePickerCalendar
        locale={locale}
        startDate={startDate}
        endDate={endDate}
      />
    );

    expect(getAllByText('1')[0].parentElement).toHaveClass(
      '-selected -selected-start'
    );
    expect(getAllByText('2')[0].parentElement).toHaveClass(
      '-selected -selected-middle'
    );
    expect(getAllByText('3')[0].parentElement).toHaveClass(
      '-selected -selected-end'
    );
    expect(container.querySelectorAll('.-selected').length).toBe(3);
  });

  it('should display pre-selected start date’s month on initial render', () => {
    const today = new Date();
    const pastDate = subMonths(today, 1);
    const monthName = format(pastDate, 'MMMM', { locale });

    const { getByText } = render(
      <DateRangePickerCalendar
        locale={locale}
        startDate={pastDate}
        endDate={today}
      />
    );

    expect(getByText(monthName, { exact: false })).toBeInTheDocument();
  });

  it('should display pre-selected end date’s month on initial render', () => {
    const pastDate = subMonths(new Date(), 1);
    const monthName = format(pastDate, 'MMMM', { locale });

    const { getByText } = render(
      <DateRangePickerCalendar locale={locale} endDate={pastDate} />
    );

    expect(getByText(monthName, { exact: false })).toBeInTheDocument();
  });
});
