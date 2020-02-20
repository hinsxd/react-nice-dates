import { useRef, useEffect } from 'react';

export default function useOutsideClickHandler(callback: Function) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (!ref.current?.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [callback]);

  return ref;
}
