import FormItem from '@/pages/Demo/Wusong/lib/FormItem';
import linkField from '@/pages/Demo/Wusong/lib/hoc/linkField';
import useField from '@/pages/Demo/Wusong/lib/hooks/useField';
import { InputNumber } from 'antd';
import React, { FC } from 'react';

interface Props {

}

const AgeField: FC<Props> = (_props) => {
  const [name] = useField<string>('name');
  const [age] = useField();
  console.log('age', age.value);
  return (
    <FormItem
      label='年龄'
    >
      <InputNumber placeholder={!name.value ? '请输入年龄' : name.value} />
    </FormItem>
  );
};

export default linkField(AgeField);
