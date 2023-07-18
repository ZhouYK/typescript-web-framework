import FormItem from '@/pages/Demo/Form/lib/FormItem';
import FormItemProvider from '@/pages/Demo/Form/lib/FormItemProvider';
import useNode from '@/pages/Demo/Form/lib/hooks/internal/useNode';
import { FieldInstance, FieldProps, FieldState } from '@/pages/Demo/Form/lib/interface';
import NodeProvider from '@/pages/Demo/Form/lib/NodeProvider';
import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import { useDerivedState } from 'femo';
import React, {
  FC, forwardRef, SyntheticEvent, useCallback, useContext, useEffect, useImperativeHandle, useRef,
} from 'react';
// import { defaultState } from '../config';

const fieldStateKeys: (keyof FieldState)[] = ['label', 'name', 'value', 'visible', 'preserve', 'required', 'errors', 'validateStatus', 'validator'];

function filterFieldState<V = any>(props: FieldProps<V>): FieldState<V> {
  return fieldStateKeys.reduce((pre, cur) => {
    // 在props中传入了的才会控制state
    if (`${cur}` in props) {
      // @ts-ignore
      pre[cur] = props[cur];
    }
    return pre;
  }, {});
}

function isSyntheticEvent(e: any): e is SyntheticEvent {
  return e?.constructor?.name === 'SyntheticEvent' || e?.nativeEvent instanceof Event;
}

const Field: FC<FieldProps> = forwardRef<FieldInstance, FieldProps>((props, ref) => {
  const { children, onFieldChange } = props;

  const propsRef = useRef(props);
  propsRef.current = props;

  const onFieldChangeRef = useRef(onFieldChange);
  onFieldChangeRef.current = onFieldChange;

  const [fieldState, fieldNode] = useNode(filterFieldState(props), 'field');

  const fieldNodeRef = useRef(fieldNode);
  fieldNodeRef.current = fieldNode;

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

  const onChange = useCallback((...args: any[]) => {
    const [evt] = args;
    let value = evt;
    // todo 需要处理 args，提取 value 传入 model
    if (isSyntheticEvent(evt)) {
      // @ts-ignore
      value = evt.target?.value;
    }

    if ('value' in propsRef.current) {
      const curState = fieldNodeRef.current?.instance?.model?.();
      onFieldChangeRef.current?.({
        ...curState,
        value,
      }, fieldStateRef.current, fieldNode.instance);

      return;
    }

    fieldNodeRef.current?.instance?.model((s) => ({
      ...s,
      value,
    }));
  }, []);

  useImperativeHandle(ref, () => {
    return fieldNode?.instance;
  });

  useEffect(() => {
    const unsub = fieldNode?.instance?.model?.onChange((state) => {
      // fieldStateRef.current 会更滞后一些
      onFieldChangeRef.current?.(state, fieldStateRef.current, fieldNode.instance);
    });
    return () => {
      unsub?.();
    };
  }, []);

  // 不可见则卸载组件
  if (!(fieldState.visible)) {
    return null;
  }
  return (
    <NodeProvider nodes={nodes}>
      <FormItemProvider fieldState={fieldState}>
        <FormItem
          onChange={onChange}
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
