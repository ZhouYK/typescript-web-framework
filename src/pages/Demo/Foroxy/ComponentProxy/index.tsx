import { GluerReturn, useDerivedModel } from 'femo';
import React, {
  FC, useCallback, useEffect, useRef,
} from 'react';

interface Props {
  value?: any;
  onChange?: (...args: any[]) => void;
  proxyModel: GluerReturn<any>;
  children: React.ReactElement;
}

const ComponentProxy: FC<Props> = (props) => {
  const propsRef = useRef(props);
  propsRef.current = props;

  const firstRef = useRef(true);
  const onChange = useCallback((...args: any[]) => {
    propsRef.current?.onChange?.(...args);
  }, []);

  const [result] = useDerivedModel(props.children, props, (nextSource, _prevSource) => {
    if ('value' in nextSource) {
      const currentProxy = propsRef.current.proxyModel();
      if (firstRef.current || !Object.is(currentProxy.value, nextSource.value)) {
        propsRef.current.proxyModel((_data, state) => ({
          ...state,
          value: nextSource.value,
        }));
      }
      return React.cloneElement(props.children, {
        ...props.children.props,
        value: nextSource.value,
        onChange,
      });
    }
    return props.children;
  });
  if (firstRef.current) {
    firstRef.current = false;
  }

  useEffect(() => propsRef.current.proxyModel.onChange((s) => {
    onChange(s.value);
  }), []);

  return result;
};

export default ComponentProxy;
