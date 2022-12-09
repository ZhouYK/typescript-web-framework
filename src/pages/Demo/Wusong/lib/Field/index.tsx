import FormItem from '@/pages/Demo/Wusong/lib/FormItem';
import FormItemProvider from '@/pages/Demo/Wusong/lib/FormItemProvider';
import useNode from '@/pages/Demo/Wusong/lib/hooks/internal/useNode';
import { FieldProps, FieldState } from '@/pages/Demo/Wusong/lib/interface';
import NodeProvider from '@/pages/Demo/Wusong/lib/NodeProvider';
import React, { FC } from 'react';

const fieldStateKeys: (keyof FieldState)[] = ['name', 'value', 'required', 'errors', 'validateStatus', 'validator'];
function filterFieldState<V = any>(props: FieldProps<V>): FieldState<V> {
  return fieldStateKeys.reduce((pre, cur) => {
    // @ts-ignore
    pre[cur] = props[cur];
    return pre;
  }, {} as FieldState<V>);
}

const Field: FC<FieldProps> = (props) => {
  const { children, field } = props;
  const [fieldState, fieldNode] = useNode(filterFieldState(props), 'field', field);
  return (
    <NodeProvider node={fieldNode}>
      <FormItemProvider fieldState={fieldState}>
        <FormItem
          label={props.label}
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
