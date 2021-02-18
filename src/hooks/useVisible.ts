import {
  useCallback, useEffect, useRef, useState,
} from 'react';

export interface Result {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

const useVisible = (v: boolean): Result => {
  const [visible, updateVisible] = useState(v);
  const flag = useRef(false);

  const show = useCallback(() => {
    updateVisible(true);
  }, []);

  const hide = useCallback(() => {
    updateVisible(false);
  }, []);

  const [result, updateResult] = useState(() => ({
    visible,
    show,
    hide,
  }));

  useEffect(() => {
    if (flag.current) {
      updateResult({
        visible,
        show,
        hide,
      });
    } else {
      flag.current = true;
    }
  }, [visible, show, hide]);

  return result;
};

export default useVisible;
