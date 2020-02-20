import React from 'react';
import classNames from 'classNames';
export type PopoverProps = {
  open: boolean;
  children: React.ReactNode;
};
const Popover: React.FC<PopoverProps> = ({ open, children }) => {
  return (
    <div className={classNames('nice-dates-popover', { '-open': open })}>
      {children}
    </div>
  );
};

export default Popover;
