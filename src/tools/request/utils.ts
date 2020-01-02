import axios, { CancelTokenSource } from 'axios';

export function createCacheKey(url: string, data: any): string {
  return `${url}?${JSON.stringify(data)}`;
}

export const createCancelableKey = (method: string, key: string, cancelable?: boolean): string => {
  if (cancelable) {
    return `${method}::${key}`;
  }

  return '';
};

export const createCancelTokenSource = (cancelable?: boolean): CancelTokenSource | undefined => {
  if (cancelable) {
    return axios.CancelToken.source();
  }

  return undefined;
};

interface ExceptionParams {
  source: string;
  url: string;
  response?: { [key: string]: unknown };
}

export function captureException(params: ExceptionParams): void {
  if (!window.Raven || !window.Raven.captureException) return;
  window.Raven.captureException(new Error(`Ajax Error for ${params.url}@${Date.now()}`), {
    extra: params,
  });
}
