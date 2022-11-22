import { FieldState } from '@/pages/Demo/Wusong/lib/interface';
import { gluer } from 'femo';

class InstanceHelper {
  createInstance = <V>(initState: Partial<FieldState<V>>) => {
    return {
      model: gluer(initState),
    };
  };
}

export default new InstanceHelper();
