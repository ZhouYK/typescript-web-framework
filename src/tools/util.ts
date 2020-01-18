/**
 * 查询字符串转对象
 * @param searchStr 查询字符串
 * @param initialQuery 是查询字符串的对象形式，表明每个值的类型，作为后续转化数据的依据
 */
export const queryToObject = (searchStr: string = window.location.search, initialQuery: { [index: string]: any }) => {
  let str_1 = searchStr;
  if (searchStr.startsWith('?')) {
    str_1 = searchStr.substring(1);
  }
  const obj: { [index: string]: any } = {};
  if (!str_1) return initialQuery;
  const str_2 = str_1.split('&');
  for (let i = 0; i < str_2.length; i += 1) {
    const temp = str_2[i].split('=');
    // eslint-disable-next-line no-continue
    if (temp.length < 2) continue;
    try {
      obj[temp[0]] = decodeURIComponent(temp[1]);
    } catch (e) {
      // eslint-disable-next-line prefer-destructuring
      obj[temp[0]] = temp[1];
    }
    const key = temp[0];
    const value = temp[1];
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
      obj[key] = Number(value);
    }
  }
  return obj;
};

/**
 * 对象转查询字符串
 * @param obj
 */
export const objectToQuery = (obj: { [index: string]: any }) => {
  return Object.keys(obj).reduce((pre, cur) => {
    let temp;
    if (!pre) {
      temp = `${cur}=${encodeURIComponent(obj[cur])}`;
    } else {
      temp = `${pre}&${cur}=${encodeURIComponent(obj[cur])}`;
    }
    return temp;
  }, '');
};

export function getLocalItem(key: string): string | null {
  return window.localStorage.getItem(key);
}

/**
 * 唤起 lark
 */
export const openLark = (() => {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  return (chatId: string, isUrl?: boolean) => {
    iframe.src = isUrl ? chatId : `lark://client/chat/${chatId}`;
  };
})();

export const promiseRun = (func: Function, args?: any[]) => {
  return new Promise(resolve => {
    try {
      if (args) {
        func(...args);
      } else {
        func();
      }
    } catch (e) {
      console.error(e);
    } finally {
      resolve();
    }
  });
};

/**
 * 获取标准时间对应的本地时间
 */
export const getLocaleDateTime = (() => {
  const offset = new Date().getTimezoneOffset() * 60 * 1000;
  return (date: string) => {
    const nowDate = new Date(date).getTime();
    return new Date(nowDate + offset);
  };
})();

export const tooltipTool: {
  container: HTMLElement | undefined;
  getTooltipContainer(): HTMLElement;
  setTooltipContainer(container: HTMLElement | undefined): void;
} = {
  container: undefined,
  getTooltipContainer(): HTMLElement | undefined {
    if (!tooltipTool.container) {
      return document.body;
    }
    return tooltipTool.container.parentElement;
  },
  setTooltipContainer(container: HTMLElement | undefined): void {
    tooltipTool.container = container;
  },
};
/**
 * 当前客户端浏览器是否为移动端
 */
export const isMobile = () =>
  /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
