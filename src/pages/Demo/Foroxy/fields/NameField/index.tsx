import { AgeFieldProxy } from '@/pages/Demo/Foroxy/fields/AgeField';
import useComponentProxy from '@/pages/Demo/Foroxy/hooks/useComponentProxy';
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
  const [InnerInput] = useComponentProxy(Input, proxyModel);
  useEffect(() => proxyModel.onChange((_state) => {
    console.log('name info', _state);
    console.log('ageField', ageField);
    // ageField?.((_d, s) => ({
    //   ...s,
    //   value: undefined,
    // }));
  }), [ageField]);

  return (
    <Form.Item label={label} name={fieldProxy.name}>
      <InnerInput />
    </Form.Item>
  );
};

export default NameField;
