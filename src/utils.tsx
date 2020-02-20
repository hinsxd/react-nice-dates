import { isAfter, isBefore, startOfDay } from 'date-fns';
import { ModifiersObj } from './types';

export function isSelectable(
  date: Date,
  { minimumDate, maximumDate }: { minimumDate?: Date; maximumDate?: Date }
): boolean {
  return (
    (!!minimumDate ? isAfter(date, startOfDay(minimumDate)) : true) &&
    (!!maximumDate ? isBefore(date, maximumDate) : true)
  );
}

export function mergeModifiers(
  baseModifiers: ModifiersObj,
  newModifiers?: ModifiersObj
): ModifiersObj {
  const modifiers = { ...baseModifiers };

  if (!newModifiers) {
    return baseModifiers;
  }

  Object.keys(newModifiers).forEach(name => {
    modifiers[name] = baseModifiers[name]
      ? date => baseModifiers[name](date) || newModifiers[name](date)
      : newModifiers[name];
  });

  return modifiers;
}
