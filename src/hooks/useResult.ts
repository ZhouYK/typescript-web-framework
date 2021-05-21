import {
  useCallback,
} from 'react';
import { useDerivedModel } from 'femo';

const useResult = <T extends { [index: string]: any }>(obj: T) => {
  const genResult = useCallback((o: T) => ({ ...o }), []);

  const [result] = useDerivedModel(() => genResult(obj), obj, (nextObj, prevObj, state) => {
    if (nextObj !== prevObj) {
      const nextKeys = Object.keys(nextObj);
      const prevKeys = Object.keys(prevObj);
      if (nextKeys.length !== prevKeys.length || nextKeys.some((k) => nextObj[k] !== prevObj[k])) {
        return genResult(nextObj);
      }
    }
    return state;
  });

  return result;
};

export default useResult;
