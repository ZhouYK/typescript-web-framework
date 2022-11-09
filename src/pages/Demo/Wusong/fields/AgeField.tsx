import FormItem from '@/pages/Demo/Wusong/FormItem';
import React, { FC } from 'react';
import InputNumber from '../components/InputNumber';

interface Props {

}

const AgeField: FC<Props> = (_props) => (
    <FormItem
      name='age'
      label='年龄'
    >
      <InputNumber placeholder='请输入年龄' />
    </FormItem>
);

export default AgeField;
