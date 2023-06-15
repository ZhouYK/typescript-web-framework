import FormItem from '@/pages/Demo/Form/lib/FormItem';
import FormItemProvider from '@/pages/Demo/Form/lib/FormItemProvider';
import useNode from '@/pages/Demo/Form/lib/hooks/internal/useNode';
import { FieldInstance, FieldProps, FieldState } from '@/pages/Demo/Form/lib/interface';
import NodeProvider from '@/pages/Demo/Form/lib/NodeProvider';
import React, { FC, forwardRef, useImperativeHandle } from 'react';
import { defaultState } from '../config';

const fieldStateKeys: (keyof FieldState)[] = ['label', 'name', 'value', 'visible', 'preserve', 'required', 'errors', 'validateStatus', 'validator'];

function filterFieldState<V = any>(props: FieldProps<V>): FieldState<V> {
  return fieldStateKeys.reduce((pre, cur) => {
    // 在props中传入了的才会控制state
    if (`${cur}` in props) {
      // @ts-ignore
      pre[cur] = props[cur];
    }
    return pre;
  }, { ...defaultState });
}

const Field: FC<FieldProps> = forwardRef<FieldInstance, FieldProps>((props, ref) => {
  const { children } = props;
  const [fieldState, fieldNode, instance] = useNode(filterFieldState(props), 'field');
  useImperativeHandle(ref, () => {
    return instance;
  });
  console.log('fieldState', fieldState);
  // 不可见则卸载组件
  if (!(fieldState.visible)) {
    return null;
  }
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
});
export default Field;