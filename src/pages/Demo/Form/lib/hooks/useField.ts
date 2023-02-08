import useInstance from '@/pages/Demo/Form/lib/hooks/internal/useInstance';
import {
  FieldInstance, FPath, UseInstanceOptions,
} from '@/pages/Demo/Form/lib/interface';

const useField = <V = any>(path?: FPath, options?: UseInstanceOptions): [FieldInstance<V> | null] => {
  const [instance] = useInstance(path, options, 'field');
  return [instance];
};

export default useField;
