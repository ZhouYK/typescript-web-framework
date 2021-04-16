import {
  useCallback, useEffect, useRef, useState,
} from 'react';

const useResult = <T>(obj: T) => {
  const flagRef = useRef(false);
  const deps = Object.values(obj);
  const genResult = useCallback((o: T) => ({ ...o }), []);
  const [result, updateResult] = useState<T>(() => genResult(obj));

  useEffect(() => {
    if (flagRef.current) {
      updateResult(genResult(obj));
    } else {
      flagRef.current = true;
    }
  }, [...deps]);
  return result;
};

export default useResult;
