import { NecessaryProps, ProxyContextValue } from '@/pages/Demo/Foroxy/interface';
import { GluerReturn, useDerivedState } from 'femo';
import { useContext, useEffect } from 'react';
import FormProxyContext from '../FormProvider/FormProxyContext';

const useFieldProxy = <S extends NecessaryProps>(initProxyState: S, handle: (state: S) => S, deps: any[]): [S, GluerReturn<S>] => {
  const [fieldProxy, fieldProxyModel] = useDerivedState(initProxyState, (s) => handle(s), [...deps]);
  const context = useContext<ProxyContextValue>(FormProxyContext);
  useEffect(() => {
    context.fields.set(fieldProxy.name, fieldProxyModel);
    if (context.subscriptions.has(fieldProxy.name)) {
      console.log('fieldProxy.name', fieldProxy.name, fieldProxyModel);
      context.subscriptions.get(fieldProxy.name).forEach((callback) => callback(fieldProxyModel));
    }
    return () => {
      context.fields.delete(fieldProxy.name);
      if (context.subscriptions.has(fieldProxy.name)) {
        context.subscriptions.get(fieldProxy.name).forEach((callback) => callback(null));
      }
    };
  }, [fieldProxy.name]);
  return [fieldProxy, fieldProxyModel];
};

export default useFieldProxy;
