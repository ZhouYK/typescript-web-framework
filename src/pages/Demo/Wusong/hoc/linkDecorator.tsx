import WuSongFormItemContext from '@/pages/Demo/Wusong/FormItemProvider/WuSongFormItemContext';
import { FieldModelProps } from '@/pages/Demo/Wusong/interface';
import WuSongNodeContext from '@/pages/Demo/Wusong/NodeProvider/WuSongNodeContext';
import React, {
  ComponentType, ForwardRefExoticComponent, SyntheticEvent, useCallback, useContext, useRef,
} from 'react';

function isSyntheticEvent(e: any): e is SyntheticEvent {
  return e?.constructor?.name === 'SyntheticEvent' || e?.nativeEvent instanceof Event;
}

const linkDecorator = <P extends { children?: any }, R = any>(component: ComponentType<P> | ForwardRefExoticComponent<P>, mapPropsFromFieldModelToComponent: (p: FieldModelProps) => P) => React.memo(React.forwardRef<R, FieldModelProps>((props, ref) => {
  const { children, ...rest } = props;
  const propsRef = useRef(props);
  propsRef.current = props;
  const Decorator = component as ComponentType<P>;
  const formItemProps = mapPropsFromFieldModelToComponent(rest);
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
    <Decorator {...formItemProps} ref={ref}>
      {
        React.cloneElement(children, ps)
      }
    </Decorator>
  );
}));

export default linkDecorator;
