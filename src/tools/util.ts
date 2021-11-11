import moment from 'moment';
import axios, { CancelTokenSource } from 'axios';

export const isEmpty = (value: any): boolean => value === null || value === undefined || value === '' || Object.is(value, NaN);
export const isArrayEmpty = (arr: any[]) => !(arr instanceof Array) || !arr.length;

/**
 * 查询字符串转对象
 * @param searchStr 查询字符串
 * @param initialQuery 是查询字符串的对象形式，表明每个值的类型，作为后续转化数据的依据
 * @param strict 是否开启严格模式
 * ⚠️ 对数组解析的结果做了缓存，以提升效率
 */
// 约定数组是这种形式: team_id=1,2,3,4,5
const queryCacheMap = new Map();
export const queryToObject = <T = {[index: string]: any}>(searchStr: string, initialQuery: T, strict = false): T => {
  let str_1 = `${searchStr}`;
  if (str_1.startsWith('?')) {
    str_1 = str_1.substring(1);
  }
  if (!str_1) return initialQuery;
  const obj: any = {};
  const str_2 = str_1.split('&');
  for (let i = 0; i < str_2.length; i += 1) {
    const temp = str_2[i].split('=');
    const key = temp[0];
    // 如果是严格模式，则只取initialQuery里面出现过的key
    if (strict && !(key in initialQuery)) {
      continue;
    }
    const value = temp[1] ? temp[1].trim() : '';
    // eslint-disable-next-line no-continue
    if (temp.length < 2) continue;
    try {
      obj[key] = decodeURIComponent(value);
    } catch (e) {
      // eslint-disable-next-line prefer-destructuring
      obj[key] = value;
    }
    if (isEmpty(obj[key])) {
      // @ts-ignore
      obj[key] = initialQuery[key];
    }
    // @ts-ignore
    const initialValue = initialQuery[key];
    // 只处理initialQuery中类型为boolean和number的
    // 其他值会被当做字符串
    if (typeof initialValue === 'boolean') {
      if (process.env.NODE_ENV === 'development') {
        if (obj[key] !== 'true' && obj[key] !== 'false') {
          throw new Error(
            `the value of '${key}' in url is not 'true' neither 'false', but its type in the initialQuery is boolean. please check it out`,
          );
        }
      }
      if (obj[key] === 'true') {
        obj[key] = true;
      } else {
        // 'true' 和 ' false'之外的其他值都会被处理为布尔值 true
        obj[key] = obj[key] !== 'false';
      }
    } else if (typeof initialValue === 'number') {
      obj[key] = Number(obj[key]);
    } else if (initialValue instanceof Array && !(obj[key] instanceof Array)) {
      const mapKey = obj[key];
      if (queryCacheMap.has(mapKey)) {
        obj[key] = queryCacheMap.get(mapKey);
      } else {
        // 约定的"1,2,3"这种字符串代表数组
        obj[key] = mapKey.split(',').filter((v: any) => !isEmpty(v));
        queryCacheMap.set(mapKey, [...(obj[key])]);
      }
    }
  }

  if (initialQuery) {
    const initKeys = Object.keys(initialQuery);
    initKeys.forEach((k) => {
      if (!(k in obj)) {
        // @ts-ignore
        obj[k] = initialQuery[k];
      }
    });
  }

  return obj;
};

/**
 * 对象转查询字符串
 * @param obj
 */
export const objectToQuery = (obj: { [index: string]: any }): string => {
  if (isEmpty(obj)) return null;
  return Object.keys(obj).reduce((pre, cur) => {
    let temp;
    const value = obj[cur];
    if (isEmpty(value)) {
      return pre;
    }
    if (!pre) {
      temp = `${cur}=${encodeURIComponent(value)}`;
    } else {
      temp = `${pre}&${cur}=${encodeURIComponent(value)}`;
    }
    return temp;
  }, '');
};
/**
 * 当前客户端浏览器是否为移动端
 */
export const isMobile = (): boolean => /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);

interface DefaultFn<T> {
  (value?: any): T;
}

const isDefaultFn = <T>(d: T | DefaultFn<T>): d is DefaultFn<T> => typeof d === 'function';
/**
 * 安全取操作
 * @param target
 * @param keyPath
 * @param defaultValue 当为函数时，不管取得的值是否为空，都会经过defaultValue函数处理然后返回，函数的返回值将作为最终的值。不应大量使用函数，可能会有性能问题
 */
export const getSafe = <T = any>(target: any, keyPath: string, defaultValue?: T | DefaultFn<T>): T => {
  try {
    // const regex = /^\[\d\]$/;
    const mixRegex = /^.*\[\d\]$/;
    const rest = keyPath.split('.');
    let temp = target;
    rest.forEach((key: string) => {
      if (process.env.NODE_ENV === 'development') {
        if (typeof key !== 'string') {
          throw new Error(`getValueOf: only handle the string index of Object. target: ${target}, key: ${key}`);
        }
      }
      if (mixRegex.test(key)) {
        const leftIndex = key.lastIndexOf('[');
        const rightIndex = key.lastIndexOf(']');
        const number = key.substring(leftIndex + 1, rightIndex);
        if (leftIndex === 0) {
          temp = temp && temp[Number(number)];
        } else {
          const tmpFirst = key.substring(0, leftIndex);
          temp = temp && temp[tmpFirst] && temp[tmpFirst][Number(number)];
        }
      } else {
        temp = temp && temp[key];
      }
    });
    if (isEmpty(temp)) {
      if (isDefaultFn(defaultValue)) {
        return defaultValue(temp);
      }
      return defaultValue;
    }

    if (isDefaultFn(defaultValue)) {
      return defaultValue(temp);
    }
    return temp;
  } catch (e) {
    if (isDefaultFn(defaultValue)) {
      return defaultValue();
    }
    return defaultValue;
  }
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (fn: Function, delay: number): (...args: any[]) => void => {
  let timer: NodeJS.Timer;
  return (...args: any[]): void => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const throttle = (fn: Function, period: number) => {
  let pre = Date.now();
  return (...args: any[]): void => {
    const now = Date.now();
    if (now - pre > period) {
      pre = now;
      fn(...args);
    }
  };
};

/**
 * 获取YYYY-MM-DD的日期字符串
 * @param date
 */
export const getYMD = (date: any): string => moment(date).format('YYYY-MM-DD');

export const getYMDhm = (date: any): string => {
  const dateObj = moment(date);
  return dateObj.format('YYYY-MM-DD HH:mm');
};

export const getMD = (date: any): string => moment(date).format('MM-DD');

export const genAxiosCancelSource = (): CancelTokenSource => axios.CancelToken.source();

export const regex = {
  url: (value: string): boolean => {
    const reg = /^((http(s)?):\/\/)?([-_\w])+(\.([-_\w])+)*(\.[-_\w][-_\w]+).*$/i;
    return reg.test(value);
  },
  number: (value: any): boolean => {
    const reg = /^\d+\.?$/;
    return reg.test(value);
  },
  variableName: (value: string): boolean => {
    const reg = /^(\w|\d|_)+$/i;
    return reg.test(value);
  },
  mobile: (value: string): boolean => {
    const reg = /^1[3456789]\d{9}$/;
    return reg.test(value);
  },
  email: (value: string): boolean => {
    const reg = /^\S+@\S+$/;
    return reg.test(value);
  },
  emailPrefix: (value: string): boolean => {
    const reg = /^[\S\w\d_.]+$/;
    return reg.test(value);
  },
  id: (value: string): boolean => {
    // 代码来源：https://www.cnblogs.com/ifat3/p/8570062.html
    // 此方法有问题
    // const checkCode = (val: string) => {
    //   const p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    //   const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    //   const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    //   const code = val.substring(17);
    //   if (p.test(val)) {
    //     let sum = 0;
    //     for (let i = 0; i < 17; i += 1) {
    //       // @ts-ignore
    //       sum += val[i] * factor[i];
    //     }
    //     if (parity[sum % 11] === code.toUpperCase()) {
    //       return true;
    //     }
    //   }
    //   return false;
    // };

    // 港澳通行证
    const regHM = /^[HM](([0-9]{8})|([0-9]{10}))$/;

    if (regHM.test(value)) {
      return true;
    }

    const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/i;

    const checkDate = function (val: string) {
      const pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
      if (pattern.test(val)) {
        const year = val.substring(0, 4);
        const month = val.substring(4, 6);
        const date = val.substring(6, 8);
        const date2 = new Date(`${year}-${month}-${date}`);
        if (date2 && date2.getMonth() === (parseInt(month, 10) - 1)) {
          return true;
        }
      }
      return false;
    };

    const checkProv = function (val: string) {
      const pattern = /^[1-9][0-9]/;
      const provs = {
        11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门',
      };
      if (pattern.test(val)) {
        // @ts-ignore
        if (provs[val]) {
          return true;
        }
      }
      return false;
    };

    if (reg.test(value)) {
      const date = value.substring(6, 14);
      if (checkDate(date)) {
        if (checkProv(value.substring(0, 2))) {
          return true;
        }
      }
    }

    const residencePermitReg = /^8[123]0000(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/;
    return residencePermitReg.test(value);
  },
};

export const variablePlaceholderReplace = (value: string, origin: { [index: string]: any }): string => value.replace(/{[a-zA-Z0-9_]+}/g, (match: string) => {
  // match会是 {depart_name}形如这种的
  const key = match.substring(1, match.length - 1);
  return origin[key];
});

export const stringToNumber = (str: any, radix = 10): any => {
  const result = parseInt(str, radix);
  if (Object.is(result, NaN)) {
    return str;
  }
  return result;
};

export const flatArr = (arr: any[]): any[] => {
  const temp: any[] = [];

  const iterator = (innerArr: any[]): void => {
    innerArr.forEach((item: any) => {
      if (!(item instanceof Array)) {
        temp.push(item);
      } else if (item.length === 0) {
        temp.push('');
      } else {
        iterator(item);
      }
    });
  };

  iterator(arr);
  return temp;
};

export const isInViewPortVertical = (element: HTMLElement) => {
  if (!element || !element.getBoundingClientRect) return true;
  const viewHeight = window.innerHeight || getSafe(document, 'documentElement.clientHeight');
  const boundingClientRect = element.getBoundingClientRect();
  const top = getSafe(boundingClientRect, 'top');
  // console.log('bottom', bottom, 'viewHeight', viewHeight, get(element, 'scrollTop'));
  return top >= 0 && top < viewHeight;
};

export const isNumber = (num: any): num is number => typeof num === 'number';
export const isString = (str: any): str is string => typeof str === 'string';
export const isSet = (s: any): s is Set<any> => s instanceof Set;
export const isArray = (array: any): array is Array<any> => array instanceof Array;

// prefix 结尾不要传斜杠
export const isPathStartWith = (prefix: string, path: string) => ((path.startsWith(prefix) && path === prefix) || path.startsWith(`${prefix}/`));

export const parseJsonString = <T>(jsonString: string): T => {
  let result = null;
  try {
    result = JSON.parse(jsonString);
  } catch (e) {
    // todo
  }
  return result;
};

export const luhnCheck = (card_number: string) => {
  if (!(/^[0-9]{16}$/).test(card_number)) {
    return false;
  }
  const nums = card_number.split('').reverse();
  let odd_sum = 0;
  let even_sum = 0;
  nums.forEach((num, i) => {
    let tmpNum = Number(num);
    if ((i + 1) % 2) {
      odd_sum += tmpNum * 1;
    } else {
      tmpNum *= 2;
      tmpNum = tmpNum > 9 ? (tmpNum - 9) : tmpNum;
      even_sum += tmpNum;
    }
  });
  const sum = odd_sum + even_sum;
  return !(sum % 10);
};

export const formatRegexString = (str: string) => str.replace(/(\()|(\))|(\{)|(\})|(\.)/g, (match: string) => {
  if (match === '(') {
    return '（';
  }
  if (match === ')') {
    return '（';
  }
  if (match === '}') {
    return '】';
  }
  if (match === '{') {
    return '【';
  }
  // if (match === '.') {
  //   return '点';
  // }
  return match;
});

export const getOffset = (dom: HTMLElement) => {
  let obj: HTMLElement = dom;
  let top = obj.offsetTop;
  let left = obj.offsetLeft;
  while (obj.offsetParent) {
    // @ts-ignore
    obj = obj.offsetParent;
    top += obj.offsetTop;
    left += obj.offsetLeft;
  }
  return {
    top,
    left,
  };
};
