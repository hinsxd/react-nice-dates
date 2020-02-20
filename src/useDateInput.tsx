import { useEffect, useState } from 'react';
import { format, parse, isValid, Locale } from 'date-fns';
import { isSelectable } from './utils';
import { DateChangeFn } from './types';

export type useDateInputProps = {
  locale: Locale;
  date?: Date | null;
  format?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  onDateChange: DateChangeFn;
  validate?: (date: Date) => boolean;
};

export type DateInputProps = Required<
  Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'onFocus' | 'onBlur' | 'placeholder' | 'type' | 'value'
  >
>;

export default function useDateInput({
  date: selectedDate,
  format: receivedFormatString,
  locale,
  minimumDate,
  maximumDate,
  onDateChange,
  validate,
}: useDateInputProps): DateInputProps {
  const formatString: string =
    receivedFormatString || locale.formatLong?.date({ width: 'short' }) || '';

  const formatDate = (date: Date): string =>
    format(date, formatString, { locale });
  const parseDate = (dateString: string): Date =>
    parse(dateString, formatString, selectedDate || new Date());

  const isValidAndSelectable = (date?: Date | null): boolean =>
    !!date &&
    isValid(date) &&
    isSelectable(date, { minimumDate, maximumDate }) &&
    (!validate || validate(date));

  const [value, setValue] = useState(
    isValidAndSelectable(selectedDate) ? formatDate(selectedDate as Date) : ''
  );
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleChange: DateInputProps['onChange'] = event => {
    const newValue = event.target.value;
    const parsedDate = parseDate(newValue);
    setValue(newValue);

    if (isValidAndSelectable(parsedDate)) {
      onDateChange(parsedDate);
    }
  };

  const handleBlur = () => {
    if (value) {
      const parsedDate = parseDate(value);

      if (isValidAndSelectable(parsedDate)) {
        setValue(formatDate(parsedDate));
      } else if (isValidAndSelectable(selectedDate)) {
        setValue(formatDate(selectedDate as Date));
      } else {
        setValue('');
      }
    } else if (selectedDate) {
      onDateChange(null);
    }

    setFocused(false);
  };

  useEffect(() => {
    if (!focused) {
      setValue(
        isValidAndSelectable(selectedDate)
          ? formatDate(selectedDate as Date)
          : ''
      );
    }
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    onFocus: handleFocus,
    onChange: handleChange,
    onBlur: handleBlur,
    placeholder: formatString.toLowerCase(),
    type: 'text',
    value,
  };
}
