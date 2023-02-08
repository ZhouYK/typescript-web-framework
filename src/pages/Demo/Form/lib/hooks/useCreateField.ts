import { FieldInstance, FieldState } from '@/pages/Demo/Form/lib/interface';
import instanceHelper from '@/pages/Demo/Form/lib/utils/instanceHelper';
import { useState } from 'react';

const useCreateField = <V = any>(initState?: Partial<FieldState<V>>, instance?: FieldInstance<V>): [FieldInstance<V>] => {
  const [ins] = useState(() => {
    return instance || instanceHelper.createInstance(initState);
  });
  return [ins];
};

export default useCreateField;
