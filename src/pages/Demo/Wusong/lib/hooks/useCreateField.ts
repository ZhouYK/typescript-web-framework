import { FieldInstance, FieldState } from '@/pages/Demo/Wusong/lib/interface';
import instanceHelper from '@/pages/Demo/Wusong/lib/utils/instanceHelper';
import { useState } from 'react';

const useCreateField = <V = any>(initState?: Partial<FieldState<V>>, instance?: FieldInstance<V>): [FieldInstance<V>] => {
  const [ins] = useState(() => {
    return instance || instanceHelper.createInstance(initState);
  });
  return [ins];
};

export default useCreateField;
