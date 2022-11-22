import Field from '@/pages/Demo/Wusong/lib/Field';
import useField from '@/pages/Demo/Wusong/lib/hooks/useField';
import useQueryField from '@/pages/Demo/Wusong/lib/hooks/useQueryField';
import { InputNumber } from 'antd';
import React, { FC } from 'react';

interface Props {
  name?: string;
}

const AgeField: FC<Props> = (props) => {
  const { name } = props;
  const [nameField] = useQueryField<string>('name');
  const [field] = useField<number>();
  console.log('age', field.value);
  return (
    <Field
      field={field}
      name={name || 'age'}
      label='年龄'
    >
      <InputNumber placeholder={!nameField.value ? '请输入年龄' : nameField.value} />
    </Field>
  );
};

export default AgeField;
