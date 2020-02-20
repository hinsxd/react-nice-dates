export enum FocusType {
  StartDate = 'StartDate',
  EndDate = 'EndDate',
  None = 'None',
}

export type DefaultModifierNames =
  | 'today'
  | 'outside'
  | 'wide'
  | 'disabled'
  | 'selected'
  | 'selectedStart'
  | 'selectedMiddle'
  | 'selectedEnd';

export type MonthChangeFn = (date: Date) => void;
export type DateChangeFn = (date: Date | null) => void;

export type ModifierFn = (date: Date) => boolean;
export type ModifiersObj = Record<string, ModifierFn>;

export type CalculatedModifierObj = Partial<
  Record<DefaultModifierNames, boolean> & Record<string, boolean>
>;

export type DefaultModifierClassnameObj = Record<DefaultModifierNames, string>;
export type ModifierClassnameObj = Partial<
  DefaultModifierClassnameObj & Record<string, string>
>;
