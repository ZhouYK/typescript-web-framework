import { useCallback, useState } from 'react';
import { ApiResult, ApiCode } from '@/tools/request/interface';

const useApiAuth = (initAuth: boolean): [
  boolean,
  (data: ApiResult<any>) => void,
] => {
  const [hasAuth, updateHasAuth] = useState(initAuth);

  const update = useCallback((data: ApiResult<any>) => {
    updateHasAuth(!(data?.code === ApiCode.noAuth));
  }, [updateHasAuth]);

  return [
    hasAuth,
    update,
  ];
};

export default useApiAuth;
