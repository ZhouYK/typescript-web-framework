import FormItemContext from '@/pages/Demo/Form/lib/FormItemProvider/FormItemContext';
import { FormItemProps } from '@/pages/Demo/Form/lib/interface';
import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import { useDerivedState } from 'femo';
import React, {
  FC, SyntheticEvent, useCallback, useContext, useEffect, useRef,
} from 'react';

function isSyntheticEvent(e: any): e is SyntheticEvent {
  return e?.constructor?.name === 'SyntheticEvent' || e?.nativeEvent instanceof Event;
}

const FormItem: FC<FormItemProps> = (props) => {
  const { children, onFieldChange } = props;

  const onFieldChangeRef = useRef(onFieldChange);
  onFieldChangeRef.current = onFieldChange;

  const propsRef = useRef(props);
  propsRef.current = props;
  const fieldState = useContext(FormItemContext);
  const fieldNodes = useContext(NodeContext);

  const fieldStateRef = useRef(fieldState);
  fieldStateRef.current = fieldState;

  const [fieldNode] = useDerivedState(() => {
    return fieldNodes?.[0];
  }, [fieldNodes]);

  const fieldNodeRef = useRef(fieldNode);
  fieldNodeRef.current = fieldNode;

  const onChange = useCallback((...args: any[]) => {
    const [evt] = args;
    let value = evt;
    // todo 需要处理 args，提取 value 传入 model
    if (isSyntheticEvent(evt)) {
      // @ts-ignore
      value = evt.target?.value;
    }
    fieldNodeRef.current.instance.model((s) => ({
      ...s,
      value,
    }));
  }, []);

  const count = React.Children.count(children);

  const ps = {
    ...children.props,
    value: fieldState?.value ?? '',
    onChange,
  };

  let element: JSX.Element = React.cloneElement(children, ps);
  if (count > 1 || count <= 0) {
    element = (
      <>
        {children}
      </>
    );
  }

  useEffect(() => {
    const unsub = fieldNode?.instance?.model?.onChange((state) => {
      // fieldStateRef.current 会更滞后一些
      onFieldChangeRef.current?.(state, fieldStateRef.current, fieldNode.instance);
    });
    return () => {
      unsub?.();
    };
  }, []);
  return (
    <section>
      <section>{fieldState.label}</section>
      <section>
        {element}
      </section>
      <section>{fieldState?.errors?.join?.('\n')}</section>
    </section>
  );
};

export default FormItem;
