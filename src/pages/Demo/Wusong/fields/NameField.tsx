import Field from '@/pages/Demo/Wusong/lib/Field';
import { Input } from 'antd';
import React, { FC } from 'react';

interface Props {
  name?: string;
}

const NameField: FC<Props> = (props) => {
  const { name } = props;
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
