/**
 * 请求采用配置式，更灵活一些 详情请看https://github.com/axios/axios#request-config
 * 如果有需求，可根据wrapRequest自定义指令式
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResult<T = any> {
    code: number;
    data: T;
    msg: any;
    response?: AxiosResponse;
}

// 对接口错误进行区分：如果是业务接口错误，则返回resolve状态；http status的异常，返回reject
const makeBusinessErrorResolve = (requestPromise: Promise<ApiResult<any>>) => requestPromise.catch((error) => {
    // error中有response，代表该错误是http status引发的；
    if (error.response) {
        return Promise.reject(error);
    }
    // 业务接口错误则以resolve状态返回给外部
    return error;
});

// 对所有错误进行统一提示：http status错误、业务接口错误
// @ts-ignore
const uniformErrorTip = (requestPromise: Promise<ApiResult<any>>) => requestPromise.catch((error) => {
    // todo 需要统一的提示方式
    console.error(`code:${error.code}, msg: ${error.msg}`);
    return Promise.reject(error);
});

// 统一的错误跳转页面（比如登录和无权限）
// @ts-ignore
const goSomeWhere = (requestPromise: Promise<ApiResult<any>>) => requestPromise.catch((error) => {
    if (error.response) {
        // error 为http status异常
        const { status } = error.response;
        if (status === 401) {
            // todo
        }
        if (status === 403) {
            // todo
        }
    }
    throw error;
});

const request: AxiosInstance = axios.create({
    withCredentials: true,
    timeout: 10000,
    responseType: 'json',
    validateStatus: (status: number) => (status >= 200 && status < 300) || status === 304,
    headers: {
        'Content-Type': 'application/json',
    },
});

request.interceptors.response.use(
    (res) => {
        const { data } = res;
        if (data.code !== 0) {
            console.warn(data.msg);
            // 业务reject的error中没有response
            return Promise.reject(data);
        }
        return data;
    },
    (err: any) => {
        // 进到这里来的都是Http status异常的
        const { response } = err;
        const { data, status, statusText } = response;
        // http status异常的error中会有response
        // 进一步区分：http status error中：code为数字，则为业务的错误信息（接口返回，修改了http status并且也返回了业务的错误信息）；code为字符串，则不是业务的错误信息
        let error;
        if (Object.prototype.toString.call(data) === '[object Object]') {
            error = { ...data, response };
            if ('message' in error) {
                error.msg = error.message;
                delete error.message;
            } else if (!('msg' in error)) {
                error.msg = 'Unknown';
            }
        } else if (Object.is(data, undefined) || Object.is(data, null)) {
            error = {
                code: `${status}`, // 避免和业务code冲突，变为字符串
                msg: statusText,
                data: null,
                response,
            };
        } else {
            error = {
                code: `${status}`, // 避免和业务code冲突，变为字符串
                msg: statusText,
                data,
                response,
            };
        }

        return Promise.reject(error);
    },
);

const wrapRequest = <T = any>(config: AxiosRequestConfig): Promise<ApiResult<T> | any> => goSomeWhere(request({
    ...config,
    headers: {
        ...(config.headers || {}),
    },
}) as any);

export const fetch = <T = any>(config: AxiosRequestConfig): Promise<ApiResult<T>> => wrapRequest<T>(config);

// 将非http status的reject变为resolve
export const softfetch = <T = any>(config: AxiosRequestConfig): Promise<ApiResult<T>> => makeBusinessErrorResolve(fetch(config));
