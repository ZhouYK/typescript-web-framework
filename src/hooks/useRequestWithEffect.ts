import useLoadingDelay from '@src/hooks/useLoadingDelay';
import { useEffect, useRef, useState } from 'react';

const useRequestWithEffect = (request: () => Promise<any>, initLoading: boolean, initSuccess: boolean, prevent = false): [boolean, boolean] => {
  const [loading, updateLoading] = useLoadingDelay(initLoading);
  const [success, updateSuccess] = useState(initSuccess);
  const flagRef = useRef(false);
  const cachedStatus = useRef({
    promise: null,
  });

  useEffect(() => {
    if (!flagRef.current) {
      flagRef.current = true;
      if (prevent) {
        return;
      }
    }
    updateLoading(true);
    const p = request();
    if (cachedStatus.current.promise !== p) {
      cachedStatus.current.promise = p;
    }
    p.finally(() => {
      if (p === cachedStatus.current.promise) {
        updateLoading(false);
      }
    }).then(() => {
      if (p === cachedStatus.current.promise) {
        updateSuccess(true);
      }
    }).catch(() => {
      if (p === cachedStatus.current.promise) {
        updateSuccess(false);
      }
    });
  }, [request]);

  return [loading, success];
};

export default useRequestWithEffect;
