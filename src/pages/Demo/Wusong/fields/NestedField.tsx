import NameField from '@/pages/Demo/Wusong/fields/NameField';
import FormItem from '@/pages/Demo/Wusong/FormItem';
import React, { FC } from 'react';

import AgeField from '@/pages/Demo/Wusong/fields/AgeField';

interface Props {

}

const NestedComponent = () => {
  return <section><AgeField /><NameField/></section>;
};

const NestedField: FC<Props> = () => {
  return (
    <FormItem name='nested'>
      <NestedComponent />
    </FormItem>
  );
};

export default NestedField;
