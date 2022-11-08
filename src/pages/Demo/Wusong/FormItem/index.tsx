import useFormItem from '@/pages/Demo/Wusong/hooks/useFormItem';
import { FieldModelProps } from '@/pages/Demo/Wusong/interface';
import { Form } from 'antd';
import React, { FC } from 'react';

const FormItem: FC<Partial<FieldModelProps>> = React.forwardRef((props, ref) => {
  const [FormItem] = useFormItem(Form.Item, (p) => ({
    name: p.name,
    label: p.label,
  }));

  return (
    <FormItem {...props} ref={ref}>
      {props.children}
    </FormItem>
  );
});

export default FormItem;
