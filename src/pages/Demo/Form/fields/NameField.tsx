import Field from '@/pages/Demo/Form/lib/Field';
import useField from '@/pages/Demo/Form/lib/hooks/useField';
import { Input } from 'antd';
import React, {
  FC, useEffect, useRef, useState,
} from 'react';

interface Props {
  name?: string;
  ageFieldPath?: string[];
}

const NameField: FC<Props> = (props) => {
  const { name, ageFieldPath } = props;
  // const [ageField] = useField<number>(ageFieldPath || 'age');
  const [nameField] = useField<string>('name');
  const [value, setValue] = useState();
  // console.log('ageField', ageField);

  console.log('nameField', nameField);

  return (
    <Field
      value={value}
      name={name || 'name'}
      label='名字'
      // visible={!(ageField?.value) || ageField?.value <= 10}
      onFieldChange={(state, prevState) => {
        if (!Object.is(state?.value, prevState?.value)) {
          setValue(state?.value);
        }
      }}
    >
      <Input placeholder='请输入名字' />
    </Field>
  );
};

export default NameField;
