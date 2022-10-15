import { GluerReturn } from 'femo';
import { useContext } from 'react';
import FormProxyContext from '../context/FormProxyContext';

const useQueryField = <T>(name: string): [GluerReturn<T> | null] => {
  const formContext = useContext(FormProxyContext);
  if (formContext.has(name)) return [formContext.get(name)];
  return [null];
};

export default useQueryField;
