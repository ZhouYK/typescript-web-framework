import Field from '@/pages/Demo/Wusong/lib/Field';
import useCreateField from '@/pages/Demo/Wusong/lib/hooks/useCreateField';
import useField from '@/pages/Demo/Wusong/lib/hooks/useField';
import { InputNumber } from 'antd';
import React, { FC } from 'react';

interface Props {
  name?: string;
}

const AgeField: FC<Props> = (props) => {
  const { name } = props;
  const [nameField] = useField<string>('name');
  const [field] = useCreateField<number>();
  console.log('age', field.value);
  return (
    <Field
      field={field}
      name={name || 'age'}
      label='年龄'
      validator={(v) => {
        console.log('v', v);
        if (v > 10) {
          return '不能超过10岁';
        }
        return '';
      }}
    >
      <InputNumber placeholder={!nameField.value ? '请输入年龄' : nameField.value} />
    </Field>
  );
};

export default AgeField;
