import useComponent from '@/pages/Demo/Wusong/hooks/useComponent';
import { InputProps, Input as AntInput } from 'antd';
import { InputRef } from 'antd/lib/input/Input';
import React, { FC } from 'react';

const Input: FC<InputProps> = React.forwardRef< InputProps & React.RefAttributes<InputRef>, InputProps>((props, ref) => {
  const [Target] = useComponent(AntInput);
  return (
    <Target {...props} ref={ref} />
  );
});
export default Input;
