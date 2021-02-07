import { useCallback, useState } from 'react';
import { ApiResult } from '@src/tools/request/interface';
import { getSafe } from '@src/tools/util';
import { ApiCode } from '@src/api/interface';

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
