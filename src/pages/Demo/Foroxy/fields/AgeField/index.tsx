import { NameFieldProxy } from '@/pages/Demo/Foroxy/fields/NameField';
import useComponentProxy from '@/pages/Demo/Foroxy/hooks/useComponentProxy';
import useFieldProxy from '@/pages/Demo/Foroxy/hooks/useFieldProxy';
import useQueryField from '@/pages/Demo/Foroxy/hooks/useQueryField';
import useWatchField from '@/pages/Demo/Foroxy/hooks/useWatchField';
import React, {
  FC, ReactElement, ReactNode,
} from 'react';
// import { Form, InputNumber } from 'antd';
import { Form, InputNumber } from '@arco-design/web-react';

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

  const [, nameField] = useQueryField<NameFieldProxy>('name');
  const [InnerInputNumber] = useComponentProxy(InputNumber, proxyModel);

  useWatchField<AgeFieldProxy>(name, (state) => {
    if (state.value === 20) {
      nameField((_d, s) => ({
        ...s,
        value: '小明',
      }));
    }
  });
  return (
    <Form.Item label={fieldProxy.label} field={fieldProxy.name}>
      <InnerInputNumber />
    </Form.Item>
  );
};

export default AgeField;
