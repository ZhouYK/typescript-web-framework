import Field from '@/pages/Demo/Form/lib/Field';
import useField from '@/pages/Demo/Form/lib/hooks/useField';
import { FieldInstance } from '@/pages/Demo/Form/lib/interface';
import { InputNumber } from 'antd';
import React, { FC, useRef } from 'react';

interface Props {
  name?: string;
  nameFieldPath?: string[];
  label?: any;
}

const AgeField: FC<Props> = (props) => {
  const { name, nameFieldPath, label } = props;
  const [nameField, model] = useField<string>(nameFieldPath || 'name');
  const fieldRef = useRef<FieldInstance<number>>();
  console.log('nameField in AgeField', model);
  return (
    <Field
      // field={field}
      ref={fieldRef}
      visible={nameField?.value !== '张三丰'}
      preserve
      name={name || 'age'}
      label={ label || '年龄' }
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
