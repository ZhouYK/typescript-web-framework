import useComponent from '@/pages/Demo/Wusong/hooks/useComponent';
import { InputNumberProps } from 'antd/lib/input-number';
import React, { FC } from 'react';
import { InputNumber as AntInputNumber } from 'antd';

const InputNumber: FC<InputNumberProps> = React.forwardRef<InputNumberProps & React.RefAttributes<HTMLInputElement>, InputNumberProps>((props, ref) => {
  const [Target] = useComponent(AntInputNumber);
  return (
    <Target {...props} ref={ref} />
  );
});

export default InputNumber;
