import FormItem from '@/pages/Demo/Wusong/FormItem';
import useQueryField from '@/pages/Demo/Wusong/hooks/useQueryField';
import React, { FC } from 'react';
import Input from '../components/Input';

interface Props {

}

const NameField: FC<Props> = (_props) => {
  const [age, ageField] = useQueryField('age');
  console.log('age, ageField', age, ageField);

  return (
    <FormItem
      name='name'
      label='名字'
    >
      <Input />
    </FormItem>
  );
};

export default NameField;
