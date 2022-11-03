import useFieldModel from '@/pages/Demo/Wusong/hooks/useFieldModel';
import useFormItem from '@/pages/Demo/Wusong/hooks/useFormItem';
import useComponent from '@/pages/Demo/Wusong/hooks/useComponent';
import { Form, InputNumber } from 'antd';
import { gluer } from 'femo';
import React, { FC, useState } from 'react';

interface Props {

}

const AgeField: FC<Props> = (_props) => {
  const [fieldState, fieldModel] = useFieldModel({
    name: 'age',
  });
  const [FormItem] = useFormItem(Form.Item, (p) => ({
    name: p.name,
    label: '年龄',
  }));
  const [valueModel] = useState(() => gluer(''));

  const [InnerInput] = useComponent(InputNumber, valueModel, fieldModel);

  return (
    <FormItem
      name={fieldState.name}
    >
      <InnerInput />
    </FormItem>
  );
};

export default AgeField;
