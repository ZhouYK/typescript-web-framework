import {
  FieldInstance, FieldState, FormInstance, FormState,
} from '@/pages/Demo/Wusong/lib/interface';
import { gluer } from 'femo';

class InstanceHelper {
  createInstance = <V>(initState: Partial<FieldState<V> | FormState<V>>): FormInstance<V> | FieldInstance<V> => {
    const model = gluer(initState);
    return {
      model,
      validate: () => Promise.resolve(model()?.value),
    };
  };
}

export default new InstanceHelper();
