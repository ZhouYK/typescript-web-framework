import type {
  FieldInstance,
  FieldState,
  FNode,
  FPath,
  QueryFieldInstanceOptions,
} from '../interface';
import useFieldInstance from './internal/useFieldInstance';
import useGenNode from './internal/useGenNode';

interface UseField {
  <V = any>(): [FieldInstance<V> | null, FNode<FieldState<V>> | null];
  <V = any>(
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    path: FPath,
  ): [FieldInstance<V> | null, FNode<FieldState<V>> | null];
  <V = any>(
    path: FPath,
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    options: QueryFieldInstanceOptions,
  ): [FieldInstance<V> | null, FNode<FieldState<V>> | null];
}

// @ts-expect-error 入参类型不匹配
const useField: UseField = (...args: any[]) => {
  const [path, options] = args;
  const field = useGenNode('field');
  const instance = useFieldInstance(path, options);
  if (args.length) {
    return [instance, instance?.node];
  }
  return [null, field];
};

export default useField;
