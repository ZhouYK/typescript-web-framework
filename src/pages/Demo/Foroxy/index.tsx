import AgeField from '@/pages/Demo/Foroxy/fields/AgeField';
import NameField from '@/pages/Demo/Foroxy/fields/NameField';
import useFormProxy from '@/pages/Demo/Foroxy/hooks/useFormProxy';
import { Button, Form } from '@arco-design/web-react';
import React, { FC } from 'react';
import '@arco-design/web-react/dist/css/arco.css';

interface Props {

}

const Foroxy: FC<Props> = (_props) => {
  const [form] = Form.useForm();
  const onSubmit = () => {
    form.validate().then((value) => {
      console.log('value', value);
    });
  };
  const [FormProxy] = useFormProxy(Form);
  return (
    <section style={{ background: 'white', padding: '24px' }}>
      <FormProxy form={form} labelCol={{
        span: 1,
      }}>
        <NameField name='name' label='名字' />
        <AgeField name='age' label='年龄' />
      </FormProxy>
      <Button type='primary' onClick={onSubmit}>提交</Button>
    </section>
  );
};

export default React.memo(Foroxy);
