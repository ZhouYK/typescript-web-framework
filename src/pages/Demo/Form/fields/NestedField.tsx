import NameField from '@/pages/Demo/Form/fields/NameField';
import Field from '@/pages/Demo/Form/lib/Field';
import React, { FC } from 'react';

import AgeField from '@/pages/Demo/Form/fields/AgeField';

interface Props {

}

const NestedComponent = () => {
  return (
    <section style={{ padding: '24px' }}>
      <section>嵌套字段</section>
      <NameField name='sub-name' ageFieldPath={['test', 'sub-age']}/>
      <AgeField name='sub-age' nameFieldPath={['test', 'sub-name']} />
    </section>
  );
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
