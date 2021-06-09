import { queryToObject } from '@src/tools/util';
import { useDerivedModel } from 'femo';

const useQueryObjStrict = <T>(search = '', initQuery: T, compensate?: (q: T) => T): [T] => {
  const [queryObj] = useDerivedModel(() => {
    const tmp = queryToObject(search, initQuery, true);
    if (compensate) {
      return compensate(tmp);
    }
    return tmp;
  }, search, (ns, ps, s) => {
    if (ns !== ps) {
      const t = queryToObject(search, initQuery, true);
      if (compensate) {
        return compensate(t);
      }
      return t;
    }
    return s;
  });
  return [queryObj];
};

export default useQueryObjStrict;
