import useFieldModel from '@/pages/Demo/Wusong/hooks/useFieldModel';
import useFormItem from '@/pages/Demo/Wusong/hooks/useFormItem';
import useComponent from '@/pages/Demo/Wusong/hooks/useComponent';
import useQueryField from '@/pages/Demo/Wusong/hooks/useQueryField';
import { Form, Input } from 'antd';
import { gluer } from 'femo';
import React, { FC, useState } from 'react';

interface Props {

}

const NameField: FC<Props> = (_props) => {
  const [fieldState, fieldModel] = useFieldModel({
    name: 'name',
  });
  const [FormItem] = useFormItem(Form.Item, (p) => ({
    name: p.name,
    label: '名字',
  }));
  const [valueModel] = useState(() => gluer(''));

  const [InnerInput] = useComponent(Input, valueModel, fieldModel);

  const [age, ageField] = useQueryField('age');
  console.log('age, ageField', age, ageField);

  return (
    <FormItem
      name={fieldState.name}
    >
      <InnerInput />
    </FormItem>
  );
};

export default NameField;
