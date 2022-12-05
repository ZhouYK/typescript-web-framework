import FormItem from '@/pages/Demo/Wusong/lib/FormItem';
import FormItemProvider from '@/pages/Demo/Wusong/lib/FormItemProvider';
import useNode from '@/pages/Demo/Wusong/lib/hooks/internal/useNode';
import { FieldInstance, FieldState } from '@/pages/Demo/Wusong/lib/interface';
import NodeProvider from '@/pages/Demo/Wusong/lib/NodeProvider';
import React, { FC, ReactElement } from 'react';

interface Props<V = any> extends FieldState<V> {
  children: ReactElement;
  field?: FieldInstance<V>;
}

const Field: FC<Props> = (props) => {
  const { children, field, ...rest } = props;
  const [fieldState, fieldNode] = useNode(rest, 'field', field);
  return (
    <NodeProvider node={fieldNode}>
      <FormItemProvider fieldState={fieldState}>
        <FormItem
          label={fieldState.label}
        >
          {
            children
          }
        </FormItem>
      </FormItemProvider>
    </NodeProvider>
  );
};
export default Field;
