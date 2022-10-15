import { NecessaryProps, ProxyContextValue } from '@/pages/Demo/Foroxy/interface';
import { GluerReturn, useDerivedState } from 'femo';
import { useContext, useEffect } from 'react';
import FormProxyContext from '../context/FormProxyContext';

const useFieldProxy = <S extends NecessaryProps>(initProxyState: S, handle: (state: S) => S, deps: any[]): [S, GluerReturn<S>] => {
  const [fieldProxy, fieldProxyModel] = useDerivedState(initProxyState, (s) => handle(s), [...deps]);
  const context = useContext<ProxyContextValue>(FormProxyContext);
  useEffect(() => {
    context.set(fieldProxy.name, fieldProxyModel);
    return () => {
      context.delete(fieldProxy.name);
    };
  }, []);
  return [fieldProxy, fieldProxyModel];
};

export default useFieldProxy;
