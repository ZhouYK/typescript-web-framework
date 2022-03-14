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
    if (obj[key] === null || obj[key] === undefined) {
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
        obj[key] = mapKey.split(',').filter((v: string) => v);
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
  if (!obj) return null;
  return Object.keys(obj).reduce((pre, cur) => {
    let temp;
    const value = obj[cur];
    if (value === undefined || value === null) {
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

export const isInViewPortVertical = (element: HTMLElement) => {
  if (!element || !element.getBoundingClientRect) return true;
  const viewHeight = window.innerHeight ?? document.documentElement?.clientHeight;
  const boundingClientRect = element.getBoundingClientRect();
  const top = boundingClientRect?.top;
  // console.log('bottom', bottom, 'viewHeight', viewHeight, get(element, 'scrollTop'));
  return top >= 0 && top < viewHeight;
};

export const variablePlaceholderReplace = (value: string, origin: { [index: string]: any }): string => value.replace(/{[a-zA-Z0-9_]+}/g, (match: string) => {
  // match会是 {depart_name}形如这种的
  const key = match.substring(1, match.length - 1);
  return origin[key];
});
