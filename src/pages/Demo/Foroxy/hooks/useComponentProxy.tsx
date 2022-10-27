import { GluerReturn, useDerivedModel } from 'femo';
import React, {
  ComponentType, ForwardRefExoticComponent, useCallback, useEffect, useRef, useState,
} from 'react';

function useComponentProxy<P, S>(component: ComponentType<P> | ForwardRefExoticComponent<P>, proxyModel: GluerReturn<S>) {
  const proxyModelRef = useRef(proxyModel);
  const FinalComponent = useCallback(React.forwardRef<P, P>((props, ref) => {
    const Component = component;
    const propsRef = useRef(props);
    propsRef.current = props;
    const onChange = useCallback((...args: any[]) => {
      // @ts-ignore
      propsRef.current?.onChange?.(...args);
    }, []);

    useState(() => {
      if ('value' in props) {
        // todo 这里不需要触发自身组件的重渲染
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
        // @ts-ignore
        if (!Object.is(prevSource.value, nextSource.value)) {
          // todo 这里不需要触发自身组件的重渲染
          proxyModelRef.current((_data, state) => ({
            ...state,
            // @ts-ignore
            value: nextSource.value,
          }));
        }
        // @ts-ignore
        return <Component {...nextSource} value={nextSource.value} onChange={onChange} ref={ref} />;
      }
      // @ts-ignore
      return <Component {...nextSource} ref={ref} />;
    });
    useEffect(() => proxyModelRef.current.onChange((s) => {
      // @ts-ignore
      onChange(s.value);
    }), [proxyModelRef.current]);
    return result;
  }), [component]);

  return [FinalComponent];
}

export default useComponentProxy;
