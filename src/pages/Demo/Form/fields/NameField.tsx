import Field from '@/pages/Demo/Form/lib/Field';
import useField from '@/pages/Demo/Form/lib/hooks/useField';
import { Input } from 'antd';
import React, { FC } from 'react';

interface Props {
  name?: string;
}

const NameField: FC<Props> = (props) => {
  const { name } = props;
  const [ageField] = useField<number>('age');
  console.log('name field 里获取到的 age field', ageField);
  return (
    <Field
      name={name || 'name'}
      label='名字'
    >
      <Input placeholder='请输入名字' />
    </Field>
  );
};

export default NameField;
