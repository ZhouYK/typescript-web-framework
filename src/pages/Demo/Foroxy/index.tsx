import AgeField from '@/pages/Demo/Foroxy/fields/AgeField';
import NameField from '@/pages/Demo/Foroxy/fields/NameField';
import { Button, Form } from 'antd';
import React, { FC } from 'react';
import FormProvider from './FormProvider';

interface Props {

}

const Foroxy: FC<Props> = (_props) => {
  const [form] = Form.useForm();
  const onSubmit = () => {
    form.validateFields().then((values) => {
      console.log('values', values);
    });
  };
  console.log('form');
  return (
    <>
      <Form form={form}>
        <FormProvider>
          <NameField name='name' label='名字' />
          <AgeField name='age' label='年龄' />
        </FormProvider>
      </Form>
      <Button onClick={onSubmit}>提交</Button>
    </>
  );
};

export default React.memo(Foroxy);
