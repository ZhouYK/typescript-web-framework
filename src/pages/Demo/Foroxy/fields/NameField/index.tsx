import { AgeFieldProxy } from '@/pages/Demo/Foroxy/fields/AgeField';
import useComponentProxy from '@/pages/Demo/Foroxy/hooks/useComponentProxy';
import useFieldProxy from '@/pages/Demo/Foroxy/hooks/useFieldProxy';
import useWatchField from '@/pages/Demo/Foroxy/hooks/useWatchField';
import React, {
  FC, ReactElement, ReactNode,
} from 'react';
// import { Form, Input } from 'antd';
import { Form, Input } from '@arco-design/web-react';
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
  const [, ageField] = useQueryField<AgeFieldProxy>('age');
  const [InnerInput] = useComponentProxy(Input, proxyModel);

  useWatchField(name, (_state) => {
    ageField((_d, s) => ({
      ...s,
      label: `好年龄${Date.now()}`,
    }));
  });

  return (
    <Form.Item label={label} field={fieldProxy.name}>
      <InnerInput />
    </Form.Item>
  );
};

export default NameField;
