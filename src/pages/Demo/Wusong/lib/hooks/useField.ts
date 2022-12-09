import useInstance from '@/pages/Demo/Wusong/lib/hooks/internal/useInstance';
import {
  FieldInstance, FPath, UseInstanceOptions,
} from '@/pages/Demo/Wusong/lib/interface';

const useField = <V = any>(path?: FPath, options?: UseInstanceOptions): [FieldInstance<V> | null] => {
  const [instance] = useInstance(path, options, 'field');
  return [instance];
};

export default useField;
