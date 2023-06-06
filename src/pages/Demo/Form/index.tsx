import AgeField from '@/pages/Demo/Form/fields/AgeField';
import Test, { Text } from '@/pages/Demo/Form/components/Test';
import NestedField from '@/pages/Demo/Form/fields/NestedField';
import Form from '@/pages/Demo/Form/lib/Form';
// import useCreateForm from '@/pages/Demo/Form/lib/hooks/useCreateForm';
import { FormInstance } from '@/pages/Demo/Form/lib/interface';
import { Button } from '@arco-design/web-react';
import React, {
  FC, useRef, useState,
} from 'react';
import NameField from '@/pages/Demo/Form/fields/NameField';

interface Props {

}

const WuSong: FC<Props> = (_props) => {
  const [n] = useState(0);
  // const [form] = useCreateForm();

  const formRef = useRef<FormInstance>();
  const onClick = () => {
    formRef.current.validate().then((res) => {
      console.log('res', res);
    }).catch((err) => {
      console.log('err', err);
    });
  };
  return (
    <Form
      // form={form}
      ref={formRef}
      name='form'>
      <NameField/>
      <AgeField />
      <NestedField/>
      <Test>
        <Text n={n} text='hello' />
      </Test>
      <Button onClick={onClick}>提交</Button>
    </Form>
  );
};

export default WuSong;
