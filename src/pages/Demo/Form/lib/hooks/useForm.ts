import FormContext from '@/pages/Demo/Form/lib/FormProvider/FormContext';
import { FNode, FormState } from '@/pages/Demo/Form/lib/interface';
import { useContext } from 'react';

const useForm = <V>(): [FormState<V> | null, FNode<FormState<V>> | null] => {
  const formContext = useContext(FormContext);

  return [formContext.node.instance, formContext.node];
};

export default useForm;
