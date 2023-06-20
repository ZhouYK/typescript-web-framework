import Field from '@/pages/Demo/Form/lib/Field';
import useField from '@/pages/Demo/Form/lib/hooks/useField';
import { Input } from 'antd';
import React, { FC } from 'react';

interface Props {
  name?: string;
  ageFieldPath?: string[];
}

const NameField: FC<Props> = (props) => {
  const { name, ageFieldPath } = props;
  const [ageField] = useField<number>(ageFieldPath || 'age');
  return (
    <Field
      name={name || 'name'}
      label='名字'
      visible={!(ageField?.value) || ageField?.value <= 10}
    >
      <Input placeholder='请输入名字' />
    </Field>
  );
};

export default NameField;
