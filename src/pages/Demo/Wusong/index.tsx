import AgeField from '@/pages/Demo/Wusong/fields/AgeField';
import Test, { Text } from '@/pages/Demo/Wusong/components/Test';
import NestedField from '@/pages/Demo/Wusong/fields/NestedField';
import Form from '@/pages/Demo/Wusong/lib/Form';
import React, {
  FC, useState,
} from 'react';
import NameField from '@/pages/Demo/Wusong/fields/NameField';

interface Props {

}

const WuSong: FC<Props> = (_props) => {
  const [n] = useState(0);
  return (
    <Form name='form'>
      <NameField/>
      <AgeField />
      <NestedField/>
      <Test>
        <Text n={n} text='hello' />
      </Test>
    </Form>
  );
};

export default WuSong;
