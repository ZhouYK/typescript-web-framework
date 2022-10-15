import ComponentProxy from '@/pages/Demo/Foroxy/ComponentProxy';
import { AgeFieldProxy } from '@/pages/Demo/Foroxy/fields/AgeField';
import useFieldProxy from '@/pages/Demo/Foroxy/hooks/useFieldProxy';
import React, {
  FC, ReactElement, ReactNode, useEffect,
} from 'react';
import { Form, Input } from 'antd';
import useQueryField from '../../hooks/useQueryField';

interface Props {
  name: string;
  label?: ReactNode | ReactElement;
}

export interface NameFieldProxy {
  name: string;
  label?: ReactNode | ReactElement;
  value?: number;
}

const NameField: FC<Props> = (props) => {
  const { name, label } = props;
  const [fieldProxy, proxyModel] = useFieldProxy({
    name,
    label,
  }, (s) => ({
    ...s,
    name,
    label,
  }), [name, label]);

  const [ageField] = useQueryField<AgeFieldProxy>('age');

  useEffect(() => proxyModel.onChange((_state) => {
    ageField?.((_d, s) => ({
      ...s,
      value: undefined,
    }));
  }), [ageField]);

  return (
    <Form.Item label={label} name={fieldProxy.name}>
      <ComponentProxy proxyModel={proxyModel}>
        <Input />
      </ComponentProxy>
    </Form.Item>
  );
};

export default NameField;
