import { FormInstance, FormState } from '@/pages/Demo/Wusong/lib/interface';
import instanceHelper from '@/pages/Demo/Wusong/lib/utils/instanceHelper';
import { useState } from 'react';

const useCreateForm = <V = any>(initState?: Partial<FormState<V>>, instance?: FormInstance<V>): [FormInstance<V>] => {
  const [ins] = useState(() => {
    return instance || instanceHelper.createInstance(initState);
  });
  return [ins];
};

export default useCreateForm;
