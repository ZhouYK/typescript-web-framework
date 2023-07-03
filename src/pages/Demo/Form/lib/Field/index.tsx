import FormItem from '@/pages/Demo/Form/lib/FormItem';
import FormItemProvider from '@/pages/Demo/Form/lib/FormItemProvider';
import useNode from '@/pages/Demo/Form/lib/hooks/internal/useNode';
import { FieldInstance, FieldProps, FieldState } from '@/pages/Demo/Form/lib/interface';
import NodeProvider from '@/pages/Demo/Form/lib/NodeProvider';
import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import { useDerivedState } from 'femo';
import React, {
  FC, forwardRef, useContext, useImperativeHandle, useRef,
} from 'react';
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
  const { children, onFieldChange } = props;

  const [fieldState, fieldNode] = useNode(filterFieldState(props), 'field', {
    onFieldChange,
  });

  // 缓存 fieldState
  const fieldStateRef = useRef(fieldState);
  fieldStateRef.current = fieldState;

  const contextNodes = useContext(NodeContext);

  const [nodes] = useDerivedState(() => {
    return [
      fieldNode,
      ...(contextNodes || []),
    ];
  }, [fieldNode, contextNodes]);

  useImperativeHandle(ref, () => {
    return fieldNode?.instance;
  });

  // 不可见则卸载组件
  if (!(fieldState.visible)) {
    return null;
  }
  return (
    <NodeProvider nodes={nodes}>
      <FormItemProvider fieldState={fieldState}>
        <FormItem
          onFieldChange={onFieldChange}
        >
          {
            children
          }
        </FormItem>
      </FormItemProvider>
    </NodeProvider>
  );
});
export default Field;
