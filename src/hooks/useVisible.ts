import {
  useCallback, useRef, useState,
} from 'react';
import { useDerivedState } from 'femo';

export interface Result<T> {
  visible: boolean;
  show: () => void;
  hide: () => void;
  data: T;
}

const useVisible = <T = any>(v: boolean): Result<T> => {
  const [visible, updateVisible] = useState(v);
  const dataRef = useRef<T>(null);

  const show = useCallback((d?: T) => {
    dataRef.current = d;
    updateVisible(true);
  }, []);

  const hide = useCallback(() => {
    dataRef.current = null;
    updateVisible(false);
  }, []);

  const [result] = useDerivedState(() => ({
    visible,
    show,
    hide,
    data: dataRef.current,
  }), [visible, show, hide, dataRef.current]);

  return result;
};

export default useVisible;
