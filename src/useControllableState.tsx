import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @usage
 *  - value ✓   changeHandler ✓:
 *  The state of value is lifted up in parent component and is passed as a prop. Change requests are also handled
 *  in parent component. Useful when parent component needs to intercept value changes (validation for example).
 *
 *  - value ✓   changeHandler ✗:
 *  value is controlled (forced), and it's independent of normal change mechanism provided by the component.
 *  not so common use case. A readonly control is an example of such usage.
 *
 *  - value ✗   changeHandler ✓:
 *  user just wants to get informed of changes. The value is kept
 *  as a local state in component itself, and parent component just needs to react to its changes.
 *  changeHandler here is a mere callback, it can't control value in any way.
 *
 *  - value ✗   changeHandler ✗:
 *  State is handled inside component.
 *  common use cases are for components such as a zippy, a tab view, a window, when you just want the UI functionality
 *  but you don't care about its state.
 *
 * @param value
 * @param changeHandler
 * @param initialValue
 * @param valueRef
 */

let warnedUserForModeRegression = false;

export default function useControllableState<T>(
  value: T | undefined,
  changeHandler: ((value: T) => void) | undefined,
  initialValue: T | (() => T)
): [T, (value: T) => void] {
  const [stateValue, setState] = useState(initialValue);
  const prevValue = usePrevious(value);
  const wasControlled = prevValue === undefined;
  const isControlled = value !== undefined;
  if (isControlled !== wasControlled) {
    //TODO: maybe use invariant npm package
    if (process.env.NODE_ENV !== 'production' && !warnedUserForModeRegression) {
      warnedUserForModeRegression = true;
      console.warn(
        '[useControllableState] WARNING: control mode is changed from controlled to uncontrolled or vice versa.'
      );
    }
  }
  const effectiveValue = (isControlled ? value : stateValue) as T;
  return [
    effectiveValue,
    useCallback(
      newValue => {
        setState(newValue);
        if (changeHandler) {
          changeHandler(newValue);
        }
      },
      [changeHandler]
    ),
  ];
}

function usePrevious<T>(value: T) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// function isFunction<S>(a: SetStateAction<S>): a is (prevState: S) => S {
//   return typeof a === 'function';
// }
