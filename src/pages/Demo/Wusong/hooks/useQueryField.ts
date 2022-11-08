import { gluer, GluerReturn, useModel } from 'femo';
import {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import WuSongFormContext from '../FormProvider/WuSongFormContext';

const useQueryField = <T>(name: string): [T | undefined, GluerReturn<T> | null] => {
  const [, rerender] = useState(null);
  const formContext = useContext(WuSongFormContext);
  const currentModelRef = useRef(null);
  const [defaultModel] = useState(() => gluer(undefined));
  const callback = useCallback((target: GluerReturn<any>) => {
    if (!Object.is(currentModelRef.current, target)) {
      currentModelRef.current = target;
      // target 没有，则表示字段卸载了。此时该字段已从 formContext.fields 中删除。
      rerender({});
    }
  }, []);

  if (!formContext.subscriptions.has(name)) {
    formContext.subscriptions.set(name, [callback]);
  } else {
    const rc = formContext.subscriptions.get(name);
    if (!rc.includes(callback)) {
      rc.push(callback);
    }
  }
  // 只有字段模型为空时，才做直接判断赋值
  // 其他情况都走 callback 更新
  if (!currentModelRef.current && formContext.fields.has(name)) {
    currentModelRef.current = formContext.fields.get(name);
  }

  useEffect(() => () => {
    const rc = formContext.subscriptions.get(name);
    const index = rc.indexOf(callback);
    rc.splice(index, 1);
    if (rc.length === 0) {
      formContext.subscriptions.delete(name);
    }
  }, []);

  const [result, model] = useModel(currentModelRef.current || defaultModel);

  return [result, model];
};

export default useQueryField;
