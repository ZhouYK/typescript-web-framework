import { AxiosRequestConfig } from 'axios';

export enum ApiCode {
  ok = 0,
  limitValid = 10,
  needLogin = 100,
  noAuth = 200,
  httpError = 'httpErrorCode',
  cancelError = 'cancelErrorCode',
}

export interface ApiResult<T> {
  code: ApiCode;
  msg: string;
  data: T;
}

export interface CustomConfig extends AxiosRequestConfig{
  showHttpError?: boolean;
  showBizError?: boolean;
}
