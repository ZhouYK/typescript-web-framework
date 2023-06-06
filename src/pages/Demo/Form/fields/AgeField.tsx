import Field from '@/pages/Demo/Form/lib/Field';
// import useCreateField from '@/pages/Demo/Form/lib/hooks/useCreateField';
import useField from '@/pages/Demo/Form/lib/hooks/useField';
import { FieldInstance } from '@/pages/Demo/Form/lib/interface';
import { InputNumber } from 'antd';
import React, { FC, useRef } from 'react';

interface Props {
  name?: string;
}

const AgeField: FC<Props> = (props) => {
  const { name } = props;
  const [nameField] = useField<string>('name');
  // const [field] = useCreateField<number>();
  const fieldRef = useRef<FieldInstance<number>>();

  return (
    <Field
      // field={field}
      ref={fieldRef}
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
      <InputNumber placeholder={nameField?.value ? '请输入年龄' : nameField?.value} />
    </Field>
  );
};

export default AgeField;
