import useInstance from '@/pages/Demo/Wusong/lib/hooks/internal/useInstance';
import {
  FormInstance, FPath, UseInstanceOptions,
} from '@/pages/Demo/Wusong/lib/interface';

const useForm = <V = any>(path?: FPath, options?: UseInstanceOptions): [FormInstance<V> | null] => {
  const [instance] = useInstance(path, options, 'form');
  return [instance];
};

export default useForm;
