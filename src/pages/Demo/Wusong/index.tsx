import AgeField from '@/pages/Demo/Wusong/fields/AgeField';
import Test, { Text } from '@/pages/Demo/Wusong/components/Test';
import NestedField from '@/pages/Demo/Wusong/fields/NestedField';
import Form from '@/pages/Demo/Wusong/lib/Form';
import React, {
  FC, useEffect, useState,
} from 'react';
import NameField from '@/pages/Demo/Wusong/fields/NameField';

interface Props {

}

const WuSong: FC<Props> = (_props) => {
  const [n, update] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      update((prevState) => {
        if (prevState > 10) {
          window.clearInterval(timer);
        }
        return prevState + 1;
      });
    }, 2000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);
  return (
    <Form>
      <NameField name='name' />
      <AgeField name='age' />
      <NestedField name='test' />
      <Test>
        <Text n={n} text='hello' />
      </Test>
    </Form>
  );
};

export default WuSong;
