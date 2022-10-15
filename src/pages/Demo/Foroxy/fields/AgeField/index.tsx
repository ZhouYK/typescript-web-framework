import ComponentProxy from '@/pages/Demo/Foroxy/ComponentProxy';
import { NameFieldProxy } from '@/pages/Demo/Foroxy/fields/NameField';
import useFieldProxy from '@/pages/Demo/Foroxy/hooks/useFieldProxy';
import useQueryField from '@/pages/Demo/Foroxy/hooks/useQueryField';
import React, {
  FC, ReactElement, ReactNode, useEffect,
} from 'react';
import { Form, InputNumber } from 'antd';

interface Props {
  name: string;
  label?: ReactNode | ReactElement;
}

export interface AgeFieldProxy {
  name: string;
  label?: ReactNode | ReactElement;
  value?: number;
}

const AgeField: FC<Props> = (props) => {
  const { name, label } = props;
  const [fieldProxy, proxyModel] = useFieldProxy<AgeFieldProxy>({
    name,
    label,
  }, (s) => ({
    ...s,
    name,
    label,
  }), [name, label]);

  const [nameField] = useQueryField<NameFieldProxy>('name');

  useEffect(() => proxyModel.onChange((state) => {
    if (state.value === 20) {
      nameField?.((_d, s) => ({
        ...s,
        value: '小明',
      }));
    }
  }), [nameField]);
  return (
    <Form.Item label={label} name={fieldProxy.name}>
      <ComponentProxy proxyModel={proxyModel}>
        <InputNumber />
      </ComponentProxy>
    </Form.Item>
  );
};

export default AgeField;
