import useInstance from '@/pages/Demo/Form/lib/hooks/internal/useInstance';
import {
  FormInstance, FPath, UseInstanceOptions,
} from '@/pages/Demo/Form/lib/interface';

const useForm = <V = any>(path?: FPath, options?: UseInstanceOptions): [FormInstance<V> | null] => {
  const [instance] = useInstance(path, options, 'form');
  return [instance];
};

export default useForm;
