import { glue } from 'femo';
import { fieldStateKeysRecord } from '../Field/constants';

import type {
  FieldInstance,
  FieldState,
  FormInstance,
  FormState,
} from '../interface';

class InstanceHelper {
  createInstance = <V>(
    initState: Partial<FieldState<V> | FormState<V>>,
    reducer?: <D>(s: typeof initState, data: D) => typeof initState,
  ): FormInstance<V> | FieldInstance<V> => {
    // value 不在，initialValue 存在，则使用 initialValue 替换 value
    // 这里替换成 value 不会造成受控，因为传入的属性中没有 value
    if (
      !(fieldStateKeysRecord.value in initState)
      && fieldStateKeysRecord.initialValue in initState
    ) {
      initState.value = initState.initialValue;
    }
    const model = reducer
      ? glue((state, data) => {
        return reducer(state, data);
      }, initState)
      : glue(initState);

    model.config({
      updatePolicy: 'merge',
    });
    return {
      model,
      validate: () => Promise.resolve(model()?.value),
    };
  };
}

export default new InstanceHelper();
