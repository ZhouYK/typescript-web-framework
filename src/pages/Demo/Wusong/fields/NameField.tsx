import FormItem from '@/pages/Demo/Wusong/FormItem';
import { Input } from 'antd';
// import useQueryField from '@/pages/Demo/Wusong/hooks/useQueryField';
import React, { FC } from 'react';

interface Props {

}

const NameField: FC<Props> = (_props) => {
  // const [age, ageField] = useQueryField('age');
  // console.log('age, ageField', age, ageField);
  return (
    <FormItem
      name='name'
      label='名字'
    >
      <Input placeholder='请输入名字' />
    </FormItem>
  );
};

export default NameField;
