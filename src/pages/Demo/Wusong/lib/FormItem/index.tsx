import WuSongFormItemContext from '@/pages/Demo/Wusong/lib/FormItemProvider/WuSongFormItemContext';
import { DecoratorProps } from '@/pages/Demo/Wusong/lib/interface';
import WuSongNodeContext from '@/pages/Demo/Wusong/lib/NodeProvider/WuSongNodeContext';
import React, {
  FC, SyntheticEvent, useCallback, useContext, useRef,
} from 'react';

function isSyntheticEvent(e: any): e is SyntheticEvent {
  return e?.constructor?.name === 'SyntheticEvent' || e?.nativeEvent instanceof Event;
}

const FormItem: FC<Partial<DecoratorProps>> = (props) => {
  // todo rest 和 fieldState 进行融合
  const { children, ...rest } = props;
  const propsRef = useRef(props);
  propsRef.current = props;
  const fieldState = useContext(WuSongFormItemContext);
  const fieldNode = useContext(WuSongNodeContext);
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
    if (fieldNodeRef.current.type === 'field') {
      fieldNodeRef.current.instance.model((_d, s) => ({
        ...s,
        value,
      }));
    } else {
      propsRef.current?.onChange(...args);
    }
  }, []);

  const ps = {
    ...children.props,
    onChange,
  };
  if (fieldNodeRef.current.type === 'field') {
    ps.value = fieldState?.value;
  }
  return (
    <section>
      <section>{rest.label}</section>
      <section>
        {React.cloneElement(children, ps)}
      </section>
    </section>
  );
};

export default FormItem;
