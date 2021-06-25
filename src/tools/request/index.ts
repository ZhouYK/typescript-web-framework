import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import { getSafe, objectToQuery } from '@src/tools/util';
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
  window.location.href = `${getSafe(data, 'login_url')}${encodeURIComponent(referer)}`;
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
  return request({
    ...config,
  }).catch((error) => {
    let code = getSafe(error, 'response.status') || ApiCode.httpError;
    if (axios.isCancel(error)) {
      code = ApiCode.cancelError;
    }

    if (config.showHttpError) {
      const msg = window.navigator.onLine ? `系统出现问题，请稍后重试(code: ${code})` : `网络连接中断，请检查网络(code: ${code})`;
      message.error(msg);
    }
    return Promise.reject({
      code,
      ...error,
    });
  }).then((res: AxiosResponse<ApiResult<T>>) => {
    const { data } = res;
    const code = getSafe(data, 'code');
    if (code === ApiCode.needLogin) {
      login(getSafe(data, 'data'), referer);
      return Promise.reject({
        code,
        data: null,
        msg: '需要登录',
      });
    }

    if (code !== ApiCode.ok && code !== ApiCode.limitValid) {
      if (config.showBizError) {
        const msg = getSafe(data, 'msg');
        const dataStr = getSafe(data, 'data');
        let errMsg = msg;
        if (!errMsg && typeof dataStr === 'string') {
          errMsg = dataStr;
        }
        message.error(errMsg || '接口未知错误');
      }
      return Promise.reject(data);
    }
    return data;
  });
};

export const makeRequestCached = <T>(apiAction: (url: string, input?: any, config?: CustomConfig) => Promise<ApiResult<T>>) => {
  let promise: Promise<ApiResult<T>>;

  return (url: string, input?: any, config?: CustomConfig): ReturnType<typeof apiAction> => {
    const status = getSafe(promise, 'status');
    if (status === 'done' || status === 'pending') {
      return promise;
    }

    promise = apiAction(url, input, config);

    // @ts-ignore
    promise.status = 'pending';
    // @ts-ignore
    return promise.then((data) => {
      // @ts-ignore
      promise.status = 'done';
      return data;
    }).catch((err) => {
      // @ts-ignore
      promise.status = 'failed';
      return Promise.reject(err);
    });
  };
};

export const wrapSuccessTip = (res: ApiResult<any>, callback: () => void) => {
  const code = getSafe(res, 'code');
  if (code === ApiCode.limitValid) {
    message.success(getSafe(res, 'msg'));
  } else {
    callback();
  }
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
