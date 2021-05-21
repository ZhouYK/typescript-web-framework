import {
  useCallback, useState,
} from 'react';
import useResult from '@src/hooks/useResult';

export interface Result {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

const useVisible = (v: boolean): Result => {
  const [visible, updateVisible] = useState(v);

  const show = useCallback(() => {
    updateVisible(true);
  }, []);

  const hide = useCallback(() => {
    updateVisible(false);
  }, []);

  return useResult({
    visible,
    show,
    hide,
  });
};

export default useVisible;
