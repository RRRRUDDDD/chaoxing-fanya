import React from 'react';
import { cn } from '../../lib/utils';

/** 表单标签 */
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-[13px] font-medium leading-none text-ink',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';

export default Label;
