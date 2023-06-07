import {
  FieldInstance, FieldState, FormInstance, FormState,
} from '@/pages/Demo/Form/lib/interface';
import { gluer } from 'femo';

class InstanceHelper {
  createInstance = <V>(initState: Partial<FieldState<V> | FormState<V>>, reducer?: <D>(s: typeof initState, data: D) => typeof initState): FormInstance<V> | FieldInstance<V> => {
    const model = reducer ? gluer((state, data) => {
      return reducer(state, data);
    }, initState) : gluer(initState);
    return {
      model,
      validate: () => Promise.resolve(model()?.value),
    };
  };
}

export default new InstanceHelper();
