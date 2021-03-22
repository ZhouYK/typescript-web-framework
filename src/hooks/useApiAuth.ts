import { useCallback, useState } from 'react';
import { ApiResult, ApiCode } from '@src/tools/request/interface';
import { getSafe } from '@src/tools/util';

const useApiAuth = (initAuth: boolean): [
  boolean,
  (data: ApiResult<any>) => void,
] => {
  const [hasAuth, updateHasAuth] = useState(initAuth);

  const update = useCallback((data: ApiResult<any>) => {
    updateHasAuth(!(getSafe(data, 'code') === ApiCode.noAuth));
  }, [updateHasAuth]);

  return [
    hasAuth,
    update,
  ];
};

export default useApiAuth;
