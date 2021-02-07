import useLoadingDelay from '@src/hooks/useLoadingDelay';
import { useCallback, useState } from 'react';

const useRequestWithCallback = <T>(request: T, initLoading: boolean, initSuccess: boolean): [T, boolean, boolean, (loading: boolean) => void] => {
  const [loading, updateLoading] = useLoadingDelay(initLoading);
  const [success, updateSuccess] = useState(initSuccess);
  const callback = useCallback((...args: any[]): Promise<any> => {
    updateLoading(true);
    // @ts-ignore
    return request(...args).finally(() => {
      updateLoading(false);
    }).then((res: any) => {
      updateSuccess(true);
      return res;
    }).catch((err: any) => {
      updateSuccess(false);
      return Promise.reject(err);
    });
  }, [request]);

  // @ts-ignore
  return [callback, loading, success, updateLoading];
};

export default useRequestWithCallback;
