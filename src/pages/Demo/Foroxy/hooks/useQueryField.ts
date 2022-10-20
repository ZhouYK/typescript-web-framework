import { GluerReturn } from 'femo';
import {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import FormProxyContext from '../FormProvider/FormProxyContext';

const useQueryField = <T>(name: string): [T | undefined, GluerReturn<T> | null] => {
  const [, rerender] = useState(0);
  const formContext = useContext(FormProxyContext);
  const currentModelRef = useRef(null);
  const callback = useCallback((target: GluerReturn<any>) => {
    if (!Object.is(currentModelRef.current, target)) {
      currentModelRef.current = target;
      console.log('useQueryField');
      // target 没有，则表示字段卸载了。此时该字段已从 formContext.fields 中删除。
      rerender((prevState) => prevState + 1);
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
  return [currentModelRef.current?.(), currentModelRef.current];
};

export default useQueryField;
