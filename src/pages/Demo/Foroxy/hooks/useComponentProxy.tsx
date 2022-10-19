import { GluerReturn, useDerivedModel } from 'femo';
import React, {
  ComponentType, useCallback, useEffect, useRef, useState,
} from 'react';

function useComponentProxy<P, S>(component: ComponentType<P>, proxyModel: GluerReturn<S>) {
  const proxyModelRef = useRef(proxyModel);

  const FinalComponent = useCallback(React.forwardRef((props, ref) => {
    const Component = component;
    const propsRef = useRef(props);
    propsRef.current = props;
    const onChange = useCallback((...args: any[]) => {
      // @ts-ignore
      propsRef.current?.onChange?.(...args);
    }, []);

    useState(() => {
      if ('value' in props) {
        // @ts-ignore
        proxyModelRef.current((_d, s) => ({
          ...s,
          // @ts-ignore
          value: props.value,
        }));
      }
    });
    // @ts-ignore
    const [result] = useDerivedModel(() => <Component {...props} />, props, (nextSource, prevSource) => {
      if ('value' in nextSource) {
        console.log('受控', nextSource);
        // @ts-ignore
        console.log('prevSource.value, nextSource.value', prevSource.value, nextSource.value);
        // @ts-ignore
        if (!Object.is(prevSource.value, nextSource.value)) {
          proxyModelRef.current((_data, state) => ({
            ...state,
            // @ts-ignore
            value: nextSource.value,
          }));
        }
        // @ts-ignore
        return <Component {...nextSource} value={nextSource.value} onChange={onChange} ref={ref} />;
      }
      console.log('不受控', nextSource);
      // @ts-ignore
      return <Component {...nextSource} ref={ref} />;
    });
    useEffect(() => proxyModelRef.current.onChange((s) => {
      console.log('执行 20 更新 name', s);
      // @ts-ignore
      onChange(s.value);
    }), [proxyModelRef.current]);
    return result;
  }), [component]);

  return [FinalComponent];
}

export default useComponentProxy;
