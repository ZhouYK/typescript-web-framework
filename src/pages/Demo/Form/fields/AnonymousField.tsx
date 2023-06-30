import AgeField from '@/pages/Demo/Form/fields/AgeField';
import NameField from '@/pages/Demo/Form/fields/NameField';
import Field from '@/pages/Demo/Form/lib/Field';
import React, { FC } from 'react';

interface Props {
  label?: any;
}

const AnonymousField: FC<Props> = (props) => {
  const { label } = props;

  return (
    <Field
      label={label || '匿名字段 1'}
    >
      <NameField />
      <AgeField />
    </Field>
  );
};

export default AnonymousField;
