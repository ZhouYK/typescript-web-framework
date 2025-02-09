import { useContext } from 'react';

import FormContext from '../FormProvider/FormContext';
import type { FNode, FormState } from '../interface';

const useForm = <V>(): [FormState<V> | null, FNode<FormState<V>> | null] => {
  const formContext = useContext(FormContext);

  return [formContext.node.instance, formContext.node];
};

export default useForm;
