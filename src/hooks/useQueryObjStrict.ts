import { useEffect, useRef, useState } from 'react';
import { queryToObject } from '@src/tools/util';

const useQueryObjStrict = <T>(search: string, initQuery: T): [T] => {
  const [queryObj, updateQueryObj] = useState(() => queryToObject(search, initQuery, true));
  const cached = useRef({ search });
  useEffect(() => {
    if (cached.current.search !== search) {
      cached.current.search = search;
      updateQueryObj(queryToObject(search, initQuery, true));
    }
  }, [search]);
  return [queryObj];
};

export default useQueryObjStrict;
