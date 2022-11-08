import WuSongFormItemContext from '@/pages/Demo/Wusong/FormItemProvider/WuSongFormItemContext';
import { useModel } from 'femo';
import React, {
  ComponentType, ForwardRefExoticComponent, SyntheticEvent, useCallback, useContext,
} from 'react';

export function isSyntheticEvent(e: any): e is SyntheticEvent {
  return e?.constructor?.name === 'SyntheticEvent' || e?.nativeEvent instanceof Event;
}

function useComponent<P, T = any>(component: ComponentType<P> | ForwardRefExoticComponent<P>) {
  const FinalComponent = useCallback(React.forwardRef<T, P>((props, ref) => {
    const Component = component;
    // todo 值 与 字段模型可能会有交互
    const fieldModel = useContext(WuSongFormItemContext);
    const [fieldState] = useModel(fieldModel);

    const onChange = useCallback((...args: any[]) => {
      const [evt] = args;
      let value = evt;
      // todo 需要处理 args，提取 value 传入 model
      if (isSyntheticEvent(evt)) {
        // @ts-ignore
        value = evt.target?.value;
      }
      fieldModel((_d, s) => ({
        ...s,
        value,
      }));
    }, []);

    return <Component {...props} onChange={onChange} value={fieldState.value} ref={ref} />;
  }), [component]);

  return [FinalComponent];
}

export default useComponent;
