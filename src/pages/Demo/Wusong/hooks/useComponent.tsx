import { FieldModelProps } from '@/pages/Demo/Wusong/interface';
import { GluerReturn, useModel } from 'femo';
import React, {
  ComponentType, ForwardRefExoticComponent, SyntheticEvent, useCallback,
} from 'react';

export function isSyntheticEvent(e: any): e is SyntheticEvent {
  return e?.constructor?.name === 'SyntheticEvent' || e?.nativeEvent instanceof Event;
}

function useComponent<P, V = any>(component: ComponentType<P> | ForwardRefExoticComponent<P>, valueModel: GluerReturn<V>, fieldModel: GluerReturn<FieldModelProps>) {
  const FinalComponent = useCallback(React.forwardRef<P, P>((props, ref) => {
    const Component = component;
    // todo 值 与 字段模型可能会有交互
    const [v] = useModel(valueModel);

    const onChange = useCallback((...args: any[]) => {
      const [evt] = args;
      let value = evt;
      // todo 需要处理 args，提取 value 传入 model
      if (isSyntheticEvent(evt)) {
        // @ts-ignore
        value = evt.target?.value;
      }
      valueModel(value);
    }, []);

    return <Component {...props} onChange={onChange} value={v} ref={ref} />;
  }), [component]);

  return [FinalComponent];
}

export default useComponent;
