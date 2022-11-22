import NameField from '@/pages/Demo/Wusong/fields/NameField';
import Field from '@/pages/Demo/Wusong/lib/Field';
import React, { FC } from 'react';

import AgeField from '@/pages/Demo/Wusong/fields/AgeField';

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
