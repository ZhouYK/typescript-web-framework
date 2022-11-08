import FormItem from '@/pages/Demo/Wusong/FormItem';
import useComponent from '@/pages/Demo/Wusong/hooks/useComponent';
import useQueryField from '@/pages/Demo/Wusong/hooks/useQueryField';
import { Input } from 'antd';
import React, { FC } from 'react';

interface Props {

}

const NameField: FC<Props> = (_props) => {
  const [InnerInput] = useComponent(Input);

  const [age, ageField] = useQueryField('age');
  console.log('age, ageField', age, ageField);

  return (
    <FormItem
      name='name'
      label='名字'
    >
      <InnerInput />
    </FormItem>
  );
};

export default NameField;
