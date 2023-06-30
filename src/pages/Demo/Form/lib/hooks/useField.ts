import useFieldInstance from '@/pages/Demo/Form/lib/hooks/internal/useFieldInstance';
import {
  FieldInstance, FNode, FPath, UseFieldInstanceOptions,
} from '@/pages/Demo/Form/lib/interface';

const useField = <V = any>(path?: FPath, options?: UseFieldInstanceOptions): [FieldInstance<V> | null, FNode<FieldInstance<V>> | null] => {
  const [instance, node] = useFieldInstance(path, options);
  return [instance, node];
};

export default useField;
