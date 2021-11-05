import { queryToObject } from '@src/tools/util';
import { useDerivedState } from 'femo';

interface UseQueryObjOptions<T> {
  compensate?: (q: T) => T;
  strict?: boolean;
}

const useQueryObj = <T>(search = '', initQuery: T, options: UseQueryObjOptions<T>): [T] => {
  const [queryObj] = useDerivedState(() => {
    const tmp = queryToObject(search, initQuery, options.strict);
    if (options.compensate) {
      return options.compensate(tmp);
    }
    return tmp;
  }, [search]);
  return [queryObj];
};

export default useQueryObj;
