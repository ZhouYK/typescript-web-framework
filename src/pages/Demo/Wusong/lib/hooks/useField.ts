import { FieldInstance, FieldState } from '@/pages/Demo/Wusong/lib/interface';
import instanceHelper from '@/pages/Demo/Wusong/lib/utils/instanceHelper';
import { useState } from 'react';

const useField = <V = any>(initState?: Partial<FieldState<V>>, instance?: FieldInstance<FieldState<V>>): [FieldInstance<FieldState<V>>] => {
  const [ins] = useState(() => {
    return instance || instanceHelper.createInstance(initState);
  });
  return [ins];
};

export default useField;
