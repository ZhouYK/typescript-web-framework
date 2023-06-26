import AgeField from '@/pages/Demo/Form/fields/AgeField';
import NameField from '@/pages/Demo/Form/fields/NameField';
import Field from '@/pages/Demo/Form/lib/Field';
import React, { FC } from 'react';

interface Props {

}

const ArrayField: FC<Props> = () => {
  const arr = [0, 1, 2, 3, 4];

  return (
    <Field name='list'>
      {
        arr.map((n) => {
          return (
            <Field key={n} name={`${n}`}>
              <NameField name='name' ageFieldPath={['list', `${n}`, 'age']} />
              <AgeField label='年龄' name='age' nameFieldPath={['list', `${n}`, 'name']} />
            </Field>
          );
        })
      }
    </Field>
  );
};

export default ArrayField;
