import { objectToQuery } from '@/tools/util';

const prefix = '/api';
const genUrl = (path: string): string => `${prefix}${path}`;
export const genUrlWithParams = (path: string, preStr: string = prefix) => (...args: any[]): string => {
  let count = 0;
  const { length } = args;
  const tempPath = path.replace(/\/{[a-zA-Z0-9_]+}/g, (match) => {
    let target: any;
    if (length) {
      target = args[count];
    } else {
      target = `:${match.substring(2, match.length - 1)}`;
    }
    count += 1;
    return `/${target}`;
  });
  return `${preStr}${tempPath}`;
};

export const genUrlWithQuery = <T = { [index: string]: any }>(path: string) => (obj: T): string => {
  const query = objectToQuery(obj);
  if (query) {
    return `${path}?${query}`;
  }
  return path;
};

export const commonApiUrls = {
  userInfo: genUrl('/home/user_info'), // 用户基本信息
};
