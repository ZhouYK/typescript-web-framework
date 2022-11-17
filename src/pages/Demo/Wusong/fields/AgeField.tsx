import FormItem from '@/pages/Demo/Wusong/lib/FormItem';
import linkField from '@/pages/Demo/Wusong/lib/hoc/linkField';
import useField from '@/pages/Demo/Wusong/lib/hooks/useField';
import { InputNumber } from 'antd';
import React, { FC } from 'react';

interface Props {

}

const AgeField: FC<Props> = (_props) => {
  const [state, model] = useField('name');

  console.log('state, model', state, model);

  return (
    <FormItem
      label='年龄'
    >
      <InputNumber placeholder='请输入年龄' />
    </FormItem>
  );
};

export default linkField(AgeField);
