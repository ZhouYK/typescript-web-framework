import FormItem from '@/pages/Demo/Form/lib/FormItem';
import FormItemProvider from '@/pages/Demo/Form/lib/FormItemProvider';
import useNode from '@/pages/Demo/Form/lib/hooks/internal/useNode';
import { FieldProps, FieldState } from '@/pages/Demo/Form/lib/interface';
import NodeProvider from '@/pages/Demo/Form/lib/NodeProvider';
import React, { FC } from 'react';

const fieldStateKeys: (keyof FieldState)[] = ['label', 'name', 'value', 'required', 'errors', 'validateStatus', 'validator'];
function filterFieldState<V = any>(props: FieldProps<V>): FieldState<V> {
  return fieldStateKeys.reduce((pre, cur) => {
    // 在props中传入了的才会控制state
    if (`${cur}` in props) {
      // @ts-ignore
      pre[cur] = props[cur];
    }
    return pre;
  }, {} as FieldState<V>);
}

const Field: FC<FieldProps> = (props) => {
  const { children, field } = props;
  const [fieldState, fieldNode] = useNode(filterFieldState(props), 'field', field);
  return (
    <NodeProvider node={fieldNode}>
      <FormItemProvider fieldState={fieldState}>
        <FormItem>
          {
            children
          }
        </FormItem>
      </FormItemProvider>
    </NodeProvider>
  );
};
export default Field;
