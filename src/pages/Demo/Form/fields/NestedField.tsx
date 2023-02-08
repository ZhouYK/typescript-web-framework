import NameField from '@/pages/Demo/Form/fields/NameField';
import Field from '@/pages/Demo/Form/lib/Field';
import React, { FC } from 'react';

import AgeField from '@/pages/Demo/Form/fields/AgeField';

interface Props {

}

const NestedComponent = () => {
  return <section><AgeField name='sub-age' /><NameField name='sub-name'/></section>;
};

const NestedField: FC<Props> = () => {
  return (
    <Field
      name='test'
    >
      <NestedComponent />
    </Field>
  );
};

export default NestedField;
