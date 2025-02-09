import axios, { AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-react';
import { objectToQuery } from '@/tools/util';
import { ApiResult, CustomConfig, ApiCode } from './interface';

const request = axios.create({
  timeout: 3600 * 1000,
  responseType: 'json',
  validateStatus: (status: number) => (status >= 200 && status < 300) || status === 304,
  headers: {
    'content-type': 'application/json',
  },
});

const login = (data: { login_url: string } | any, referer: string): void => {
  window.location.href = `${data?.login_url}${encodeURIComponent(referer)}`;
};

const defaultExtraCustomConfig = {
  showHttpError: true,
  showBizError: true,
};

const customRequest = <T>(config: CustomConfig): Promise<ApiResult<T>> => {
  const referer = window.location.href;
  config.headers = {
    ...config.headers,
    'mis-referer': referer,
    'X-Requested-With': 'XMLHttpRequest',
  };
  // if (config.url.startsWith('/api/hr/employ/offical')) {
  //   config.headers = {
  //     ...config.headers,
  //     'content-type': 'application/x-www-form-urlencoded',
  //   };
  //   config.data = objectToQuery(config.data);
  // }
  const {
    showBizError, showHttpError, ...restConfig
  } = config;
  return request({
    ...restConfig,
  }).catch((error) => {
    let code = error?.response?.status ?? ApiCode.httpError;
    if (axios.isCancel(error)) {
      code = ApiCode.cancelError;
    }

    if (showHttpError) {
      const msg = window.navigator.onLine ? `系统出现问题，请稍后重试(code: ${code})` : `网络连接中断，请检查网络(code: ${code})`;
      Message.error(msg);
    }
    return Promise.reject({
      code,
      ...error,
    });
  }).then((res: AxiosResponse<ApiResult<T>>) => {
    const { data } = res;
    const code = data?.code;
    if (code === ApiCode.needLogin) {
      login(data?.data, referer);
      return Promise.reject({
        code,
        data: null,
        msg: '需要登录',
      });
    }

    if (code !== ApiCode.ok && code !== ApiCode.limitValid) {
      if (showBizError) {
        const msg = data?.msg;
        const dataStr = data?.data;
        let errMsg = msg;
        if (!errMsg && typeof dataStr === 'string') {
          errMsg = dataStr;
        }
        Message.error(errMsg || '接口未知错误');
      }
      return Promise.reject(data);
    }
    return data;
  });
};

const customRequestFile = (config: CustomConfig): Promise<AxiosResponse<Blob>> => {
  const referer = window.location.href;
  config.headers = {
    ...config.headers,
    'mis-referer': referer,
    'X-Requested-With': 'XMLHttpRequest',
  };
  const {
    showBizError, showHttpError, ...restConfig
  } = config;
  return request({
    ...restConfig,
  }).catch((error) => {
    let code = error?.response?.status ?? ApiCode.httpError;
    if (axios.isCancel(error)) {
      code = ApiCode.cancelError;
    }

    if (showHttpError) {
      const msg = window.navigator.onLine ? `系统出现问题，请稍后重试(code: ${code})` : `网络连接中断，请检查网络(code: ${code})`;
      Message.error(msg);
    }
    return Promise.reject(error);
  });
};

export const post = <T = any>(url: string, data?: any, config?: CustomConfig): Promise<ApiResult<T>> => customRequest<T>({
  url, data, method: 'post', ...defaultExtraCustomConfig, ...config,
});

export const get = <T = any>(url: string, params?: any, config?: CustomConfig): Promise<ApiResult<T>> => customRequest<T>({
  url, params, method: 'get', ...defaultExtraCustomConfig, ...config,
});

export const del = <T = any>(url: string, data?: any, config?: CustomConfig): Promise<ApiResult<T>> => customRequest<T>({
  url, data, method: 'delete', ...defaultExtraCustomConfig, ...config,
});

export const patch = <T = any>(url: string, data?: any, config?: CustomConfig): Promise<ApiResult<T>> => customRequest<T>({
  url, data, method: 'patch', ...defaultExtraCustomConfig, ...config,
});

export const put = <T = any>(url: string, data?: any, config?: CustomConfig): Promise<ApiResult<T>> => customRequest<T>({
  url, data, method: 'put', ...defaultExtraCustomConfig, ...config,
});

export const postForm = <T = any>(url: string, data?: any, config?: CustomConfig): Promise<ApiResult<T>> => customRequest<T>({
  url, data: objectToQuery(data), method: 'post', headers: { 'content-type': 'application/x-www-form-urlencoded' }, ...defaultExtraCustomConfig, ...config,
});

export const postMultipartForm = <T = any>(url: string, data?: any, config?: CustomConfig): Promise<ApiResult<T>> => customRequest<T>({
  url, data, method: 'post', headers: { 'content-type': 'multipart/form-data' }, ...defaultExtraCustomConfig, ...config,
});

export const requestFileByGet = (url: string, params?: any, config?: CustomConfig): Promise<AxiosResponse<Blob>> => customRequestFile({
  url,
  method: 'get',
  params,
  ...defaultExtraCustomConfig,
  responseType: 'blob',
  ...config,
});

export const requestFileByPost = (url: string, data?: any, config?: CustomConfig): Promise<AxiosResponse<Blob>> => customRequestFile({
  url,
  method: 'post',
  data,
  ...defaultExtraCustomConfig,
  responseType: 'blob',
  ...config,
});
