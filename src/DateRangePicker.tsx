import React, { useRef, useState } from 'react';
import { addDays, subDays, Locale } from 'date-fns';
import { isSelectable } from './utils';
import useDateInput, { DateInputProps } from './useDateInput';
import useOutsideClickHandler from './useOutsideClickHandler';
import useDetectTouch from './useDetectTouch';
import DateRangePickerCalendar from './DateRangePickerCalendar';
import Popover from './Popover';
import {
  DateChangeFn,
  ModifiersObj,
  ModifierClassnameObj,
  FocusType,
} from './types';

const { None, StartDate, EndDate } = FocusType;

type childrenProps = {
  startDateInputProps: DateInputProps & {
    ref: React.RefObject<HTMLInputElement>;
    readOnly: boolean;
  };
  endDateInputProps: DateInputProps & {
    ref: React.RefObject<HTMLInputElement>;
    readOnly: boolean;
  };
  focus: FocusType;
};
type DateRangePickerProps = {
  children: (props: childrenProps) => any;
  locale: Locale;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: DateChangeFn;
  onEndDateChange?: DateChangeFn;
  format?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  modifiers?: ModifiersObj;
  modifiersClassNames?: ModifierClassnameObj;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  children,
  locale,
  startDate,
  endDate,
  onStartDateChange = () => {},
  onEndDateChange = () => {},
  format,
  minimumDate,
  maximumDate,
  modifiers,
  modifiersClassNames,
}) => {
  const [focus, setFocus] = useState<FocusType>(None);
  const [month, setMonth] = useState(() => startDate || endDate || new Date());
  const isTouch = useDetectTouch();
  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  const containerRef = useOutsideClickHandler(() => {
    setFocus(None);
  });

  const startDateInputProps = useDateInput({
    date: startDate,
    format,
    locale,
    maximumDate,
    minimumDate,
    onDateChange: date => {
      onStartDateChange(date);
      !!date && setMonth(date);
    },
    validate: date =>
      isSelectable(date, { maximumDate: endDate && subDays(endDate, 1) }),
  });

  const endDateInputProps = useDateInput({
    date: endDate,
    format,
    locale,
    maximumDate,
    minimumDate,
    onDateChange: date => {
      onEndDateChange(date);
      date && setMonth(date);
    },
    validate: date =>
      isSelectable(date, { minimumDate: startDate && addDays(startDate, 1) }),
  });

  return (
    <div className="nice-dates" ref={containerRef}>
      {children({
        startDateInputProps: {
          ...startDateInputProps,
          onFocus: e => {
            startDateInputProps.onFocus?.(e);
            setFocus(StartDate);

            if (isTouch) {
              startDateInputRef.current?.blur();
            }
          },
          ref: startDateInputRef,
          readOnly: isTouch,
        },
        endDateInputProps: {
          ...endDateInputProps,
          onFocus: e => {
            endDateInputProps.onFocus?.(e);
            setFocus(EndDate);

            if (isTouch) {
              endDateInputRef.current?.blur();
            }
          },
          ref: endDateInputRef,
          readOnly: isTouch,
        },
        focus,
      })}

      <Popover open={focus !== None}>
        <DateRangePickerCalendar
          locale={locale}
          startDate={startDate}
          endDate={endDate}
          focus={focus}
          month={month}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onFocusChange={setFocus}
          onMonthChange={setMonth}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
      </Popover>
    </div>
  );
};

export default DateRangePicker;
