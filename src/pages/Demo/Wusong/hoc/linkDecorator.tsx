import WuSongFormItemProvider from '@/pages/Demo/Wusong/FormItemProvider';
import useFieldNode from '@/pages/Demo/Wusong/hooks/useFieldNode';
import { FieldModelProps } from '@/pages/Demo/Wusong/interface';
import React, {
  ComponentType, ForwardRefExoticComponent, SyntheticEvent, useCallback,
} from 'react';

function isSyntheticEvent(e: any): e is SyntheticEvent {
  return e?.constructor?.name === 'SyntheticEvent' || e?.nativeEvent instanceof Event;
}

const linkDecorator = <P extends { children?: any }, R = any>(component: ComponentType<P> | ForwardRefExoticComponent<P>, mapPropsFromFieldModelToComponent: (p: FieldModelProps) => P) => React.memo(React.forwardRef<R, FieldModelProps>((props, ref) => {
  const { children, ...rest } = props;
  const Decorator = component as ComponentType<P>;
  const [fieldState, fieldNode] = useFieldNode(rest);
  const formItemProps = mapPropsFromFieldModelToComponent(fieldState);
  const onChange = useCallback((...args: any[]) => {
    const [evt] = args;
    let value = evt;
    // todo 需要处理 args，提取 value 传入 model
    if (isSyntheticEvent(evt)) {
      // @ts-ignore
      value = evt.target?.value;
    }
    fieldNode.state.model((_d, s) => ({
      ...s,
      value,
    }));
  }, []);
  return (
    <WuSongFormItemProvider fieldNode={fieldNode}>
      <Decorator {...formItemProps} ref={ref}>
          {
            React.cloneElement(children, {
              ...children.props,
              onChange,
              value: fieldState.value,
            })
          }
      </Decorator>
    </WuSongFormItemProvider>
  );
}));

export default linkDecorator;
