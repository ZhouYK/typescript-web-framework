import { ProxyContextValue } from '@/pages/Demo/Foroxy/interface';
import React from 'react';

const FormProxyContext = React.createContext<ProxyContextValue>({
  fields: new Map(),
  subscriptions: new Map(),
});

export default FormProxyContext;
