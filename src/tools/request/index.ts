/**
 * 请求采用配置式，更灵活一些 详情请看https://github.com/axios/axios#request-config
 * 如果有需求，可根据wrapRequest自定义指令式
 */
import { cloneDeep, get as getValue } from 'lodash';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import { message } from '@zyk/components';
import intl from 'react-intl-universal';
import Cookies from 'js-cookie';
import { getCurrentLocale } from '../../i18n';

import { createCacheKey, createCancelableKey, createCancelTokenSource, captureException } from './utils';

require('es6-promise').polyfill();

// eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define
export const refreshToken = () => post('/zyk/api/common/csrf/token/');

const CACHE: {
  [key: string]: any;
} = {};
const CACHE_PROMISE: {
  [key: string]: Promise<any>;
} = {};
const CACHE_CANCELTOKEN: {
  [key: string]: CancelTokenSource;
} = Object.create(null);

export interface ApiResult<T = any> {
  code: number;
  data: T;
  message: any;
  response?: AxiosResponse;
}

// 对接口错误进行区分：如果是业务接口错误，则返回resolve状态；http status的异常，返回reject
export const makeBusinessErrorResolve = (requestPromise: Promise<ApiResult<any>>) => {
  return requestPromise.catch(error => {
    // error中有response，代表该错误是http status引发的；
    if (error.response) {
      return Promise.reject(error);
    }
    // 业务接口错误则以resolve状态返回给外部
    return error;
  });
};

// 进行登录操作
const login = (headers: any, data: { next: string }) => {
  const url = getValue(headers, 'location') || getValue(data, 'next');
  if (url) {
    window.location.href = url;
  } else {
    window.location.reload();
  }
};

const request: AxiosInstance = axios.create({
  withCredentials: true,
  timeout: 30000,
  responseType: 'json',
  validateStatus: (status: number) => (status >= 200 && status < 300) || status === 304,
  headers: {
    'Content-Type': 'application/json',
    'accept-language': getCurrentLocale(),
  },
});

export interface RequestConfig extends AxiosRequestConfig {
  cache?: boolean;
  cancelable?: boolean;
  cancelableKey?: string;
  notifyHttpError?: boolean;
  notifyBizError?: boolean;
  successMessage?: string;
  retryTime?: number;
}

export const HTTP_ERROR_CODE = 10000;
export const CANCEL_CODE = 10001;

/**
 * config 增加如下参数
 * @param cache 是否使用缓存
 * @param cancelable 是否取消之前同类key请求响应未终止的请求
 * @param cancelableKey 根据指定非空字符串生成缓存key，可规避`url`不能覆盖的场景，默认值`url`
 * @param notifyHttpError 是否对 http status 不为 200 的错误（一般是服务器错误）进行 message 提示
 * @param notifyBizError 是否对后端校验类的错误进行 message 提示
 * @param successMessage 操作成功时的 Message 提示信息
 */
const wrapRequest = <T = any>(config: RequestConfig): Promise<ApiResult<T> | any> => {
  if (!config.retryTime && config.retryTime !== 0) config.retryTime = 0;
  const {
    url = '',
    method,
    cache = false,
    params = {},
    data = {},
    cancelable,
    notifyHttpError,
    notifyBizError,
    successMessage,
    retryTime,
  } = config;
  const cacheKey = createCacheKey(url, { ...params, ...data });
  const cancelableKey = createCancelableKey(method as string, config.cancelableKey || url, cancelable);
  const cancelTokenSource = createCancelTokenSource(cancelable);

  if (cancelableKey && CACHE_CANCELTOKEN[cancelableKey]) {
    CACHE_CANCELTOKEN[cancelableKey].cancel();
    delete CACHE_CANCELTOKEN[cancelableKey];
  }

  if (cancelableKey && cancelTokenSource) {
    config.cancelToken = cancelTokenSource.token;
    CACHE_CANCELTOKEN[cancelableKey] = cancelTokenSource;
  }

  // 返回成功后缓存的数据
  if (cache && CACHE[cacheKey]) {
    return Promise.resolve(cloneDeep(CACHE[cacheKey]));
  }

  // 缓存Promise
  if (cache && CACHE_PROMISE[cacheKey]) {
    return CACHE_PROMISE[cacheKey];
  }

  const clear = () => {
    // clear cached promise
    delete CACHE_PROMISE[cacheKey];
    // clear cached cancelToken
    if (cancelableKey && cancelTokenSource && cancelTokenSource === CACHE_CANCELTOKEN[cancelableKey]) {
      delete CACHE_CANCELTOKEN[cancelableKey];
    }
  };
  const axiosPromise = request({
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(config.url && config.url.startsWith('/zyk/') ? { 'x-csrf-token': Cookies.get('zyk-csrf-token') } : null),
      'accept-language': getCurrentLocale(),
    },
  })
    .catch(error => {
      let code;
      if (!axios.isCancel(error)) {
        if (error.response) {
          code = HTTP_ERROR_CODE;
          const { status, headers, data } = error.response;
          switch (status) {
            case 401:
              login(headers, data);
              break;
            case 405:
              // csrf-token 过期，重试两次
              if (config.retryTime < 2) {
                captureException({
                  source: 'axiosComponent.handleError.catch',
                  url,
                  response: { status: 405 },
                });
                config.retryTime++;
                clear();
                return refreshToken().then(() => {
                  return wrapRequest(config);
                });
              }
              break;
            default:
              break;
          }
          captureException({
            source: 'axiosComponent.handleError.httpError',
            url,
            response: {
              status: error.response && error.response.status,
              onLine: window.navigator.onLine,
            },
          });
        } else {
          captureException({
            source: 'axiosComponent.handleError.unkownError',
            url,
            response: {
              hasRequest: error.request ? 1 : 0,
              onLine: window.navigator.onLine,
            },
          });
        }
        // The request was made and the server responded with a status code
        if (notifyHttpError) {
          message.error(intl.get(window.navigator.onLine ? 'MessageHttpError' : 'MessageNetworkError'));
        }
      } else {
        code = CANCEL_CODE;
        captureException({
          source: 'axiosComponent.handleError.cancelled',
          url,
          response: { status: 'cancelled' },
        });
      }
      return Promise.reject({
        code,
        ...error,
      });
    })
    .then(res => {
      if (retryTime !== 0) return res;
      const data = getValue(res, 'data') || {};
      const { success } = data;
      if (success === false || (success === undefined && data.code !== 0)) {
        // 后端服务校验失败是提示
        const msg = data.message || data.msg;
        if (msg && notifyBizError) {
          message.error(msg);
        }
        captureException({
          source: 'axiosComponent.handleError.bizError',
          url,
          response: { code: data.code, message: msg, success },
        });
        return Promise.reject(data);
      }
      // 设置缓存
      if (cache) CACHE[cacheKey] = data;
      // 操作成功时提示
      if (successMessage) {
        message.success(successMessage);
      }
      return data;
    })
    .finally(() => {
      clear();
    });

  if (cache) CACHE_PROMISE[cacheKey] = axiosPromise;

  return axiosPromise;
};

export default wrapRequest; // 源方法，可根据这个方法自定义使用的方式

// 以下根据wrapRequest自定义使用的方式
interface ParamsOfConfig {
  [index: string]: any;
}
export const get = <T = any>(url: string, params?: ParamsOfConfig, config?: RequestConfig): Promise<ApiResult<T>> =>
  wrapRequest<T>({ url, params, method: 'get', ...config });

// 将非http status的reject变为resolve
export const softGet = <T = any>(url: string, params?: ParamsOfConfig, config?: RequestConfig): Promise<ApiResult<T>> =>
  makeBusinessErrorResolve(get<T>(url, params, config));

// application/x-www-form-urlencoded Post
export const urlencodedPost = <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> =>
  wrapRequest<T>({
    url,
    data,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    ...config,
  });

export const post = <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> =>
  wrapRequest<T>({ url, data, method: 'post', ...config });

export const put = <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> =>
  wrapRequest<T>({ url, data, method: 'put', ...config });

// 将非http status的reject变为resolve
export const softPost = <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> =>
  makeBusinessErrorResolve(post<T>(url, data, config));

export const sendDelete = <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResult<T>> =>
  wrapRequest<T>({ url, data, method: 'delete', ...config });
