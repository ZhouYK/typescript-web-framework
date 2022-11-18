import NameField from '@/pages/Demo/Wusong/fields/NameField';
import FormItem from '@/pages/Demo/Wusong/lib/FormItem';
import linkField from '@/pages/Demo/Wusong/lib/hoc/linkField';
import React, { FC } from 'react';

import AgeField from '@/pages/Demo/Wusong/fields/AgeField';

interface Props {

}

const NestedComponent = () => {
  return <section><AgeField name='sub-age' /><NameField name='sub-name'/></section>;
};

const NestedField: FC<Props> = () => {
  return (
    <FormItem>
      <NestedComponent />
    </FormItem>
  );
};

export default linkField(NestedField);
