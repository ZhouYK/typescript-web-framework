import { useEffect, useRef, useState } from 'react';
import { queryToObject } from '@src/tools/util';

const useQueryObj = <T = { [index: string]: any }>(search: string, initObj: T): [T] => {
  const flagRef = useRef(false);
  const [obj, updateObj] = useState<T>(() => queryToObject(search, initObj));
  useEffect(() => {
    if (flagRef.current) {
      updateObj(queryToObject(search, initObj));
    } else {
      flagRef.current = true;
    }
  }, [search]);
  return [obj];
};

export default useQueryObj;
