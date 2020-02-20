import React, { useState, useRef } from 'react';
import useDateInput, { DateInputProps } from './useDateInput';
import useDetectTouch from './useDetectTouch';
import useOutsideClickHandler from './useOutsideClickHandler';
import DatePickerCalendar from './DatePickerCalendar';
import Popover from './Popover';
import { Locale } from 'date-fns';
import { DateChangeFn, ModifiersObj, ModifierClassnameObj } from './types';

type DatePickerProps = {
  children: (props: {
    inputProps: DateInputProps & {
      ref: React.RefObject<HTMLInputElement>;
      readOnly: boolean;
    };
    focused: boolean;
  }) => any;
  locale: Locale;
  date?: Date;
  onDateChange?: DateChangeFn;
  format?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  modifiers?: ModifiersObj;
  modifiersClassNames?: ModifierClassnameObj;
};

const DatePicker: React.FC<DatePickerProps> = ({
  children,
  locale,
  date,
  onDateChange = () => {},
  format,
  minimumDate,
  maximumDate,
  modifiers,
  modifiersClassNames,
}) => {
  const [month, setMonth] = useState(date || new Date());
  const [focused, setFocused] = useState(false);
  const isTouch = useDetectTouch();
  const inputRef = useRef<HTMLInputElement>(null);

  const containerRef = useOutsideClickHandler(() => {
    setFocused(false);
  });

  const inputProps = useDateInput({
    date,
    format,
    locale,
    minimumDate,
    maximumDate,
    onDateChange: date => {
      onDateChange(date);
      date && setMonth(date);
    },
  });

  const handleDateChange: DateChangeFn = date => {
    onDateChange(date);
    setFocused(false);
  };

  return (
    <div className="nice-dates" ref={containerRef}>
      {children({
        inputProps: {
          ...inputProps,
          ref: inputRef,
          onFocus: e => {
            inputProps.onFocus?.(e);
            setFocused(true);

            if (isTouch) {
              inputRef.current?.blur();
            }
          },
          readOnly: isTouch,
        },
        focused,
      })}

      <Popover open={focused}>
        <DatePickerCalendar
          locale={locale}
          date={date}
          month={month}
          onDateChange={handleDateChange}
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

// DatePicker.propTypes = {
//   children: func.isRequired,
//   locale: object.isRequired,
//   date: instanceOf(Date),
//   onDateChange: func,
//   format: string,
//   minimumDate: instanceOf(Date),
//   maximumDate: instanceOf(Date),
//   modifiers: objectOf(func),
//   modifiersClassNames: objectOf(string),
// };

DatePicker.defaultProps = {
  onDateChange: () => {},
};

export default DatePicker;
