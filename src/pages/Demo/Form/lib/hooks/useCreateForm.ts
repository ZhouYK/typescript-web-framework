import { FormInstance, FormState } from '@/pages/Demo/Form/lib/interface';
import instanceHelper from '@/pages/Demo/Form/lib/utils/instanceHelper';
import { useState } from 'react';

const useCreateForm = <V = any>(initState?: Partial<FormState<V>>, instance?: FormInstance<V>): [FormInstance<V>] => {
  const [ins] = useState(() => {
    return instance || instanceHelper.createInstance(initState);
  });
  return [ins];
};

export default useCreateForm;
