import AgeField from '@/pages/Demo/Foroxy/fields/AgeField';
import NameField from '@/pages/Demo/Foroxy/fields/NameField';
import useFormProxy from '@/pages/Demo/Foroxy/hooks/useFormProxy';
import { Button, Form } from 'antd';
import React, { FC } from 'react';

interface Props {

}

const Foroxy: FC<Props> = (_props) => {
  const [form] = Form.useForm();
  const onSubmit = () => {
    form.validateFields().then((values) => {
      console.log('values', values);
    });
  };
  const [FormProxy] = useFormProxy(Form);
  return (
    <>
      <FormProxy form={form}>
        <NameField name='name' label='名字' />
        <AgeField name='age' label='年龄' />
      </FormProxy>
      <Button onClick={onSubmit}>提交</Button>
    </>
  );
};

export default React.memo(Foroxy);
