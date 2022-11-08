import FormItem from '@/pages/Demo/Wusong/FormItem';
import useComponent from '@/pages/Demo/Wusong/hooks/useComponent';
import { InputNumber } from 'antd';
import React, { FC } from 'react';

interface Props {

}

const AgeField: FC<Props> = (_props) => {
  const [InnerInput] = useComponent(InputNumber);
  return (
    <FormItem
      name='age'
      label='年龄'
    >
      <InnerInput />
    </FormItem>
  );
};

export default AgeField;
