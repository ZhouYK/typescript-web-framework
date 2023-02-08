import FormItemContext from '@/pages/Demo/Form/lib/FormItemProvider/FormItemContext';
import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import React, {
  FC, SyntheticEvent, useCallback, useContext, useRef,
} from 'react';

function isSyntheticEvent(e: any): e is SyntheticEvent {
  return e?.constructor?.name === 'SyntheticEvent' || e?.nativeEvent instanceof Event;
}

interface Props {
  children?: any;
}

const FormItem: FC<Props> = (props) => {
  const { children } = props;
  const propsRef = useRef(props);
  propsRef.current = props;
  const fieldState = useContext(FormItemContext);
  const fieldNode = useContext(NodeContext);
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

  const ps = {
    ...children.props,
    value: fieldState?.value,
    onChange,
  };
  console.log('fieldState', fieldState);
  return (
    <section>
      <section>{fieldState.label}</section>
      <section>
        {React.cloneElement(children, ps)}
      </section>
      <section>{fieldState?.errors?.join?.('\n')}</section>
    </section>
  );
};

export default FormItem;
