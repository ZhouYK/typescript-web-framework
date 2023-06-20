import Field from '@/pages/Demo/Form/lib/Field';
import useField from '@/pages/Demo/Form/lib/hooks/useField';
import { FieldInstance } from '@/pages/Demo/Form/lib/interface';
import { InputNumber } from 'antd';
import React, { FC, useRef } from 'react';

interface Props {
  name?: string;
  nameFieldPath?: string[];
}

const AgeField: FC<Props> = (props) => {
  const { name, nameFieldPath } = props;
  const [nameField] = useField<string>(nameFieldPath || 'name');
  const fieldRef = useRef<FieldInstance<number>>();
  console.log('nameField?.value', nameField?.value);
  return (
    <Field
      // field={field}
      ref={fieldRef}
      visible={nameField?.value !== '张三丰'}
      preserve
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
      <InputNumber style={{ width: 200 }} placeholder={nameField?.value ? '请输入年龄' : nameField?.value} />
    </Field>
  );
};

export default AgeField;
