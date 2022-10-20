import React, { FC, useState } from 'react';
import { ProxyContextValue } from '../interface';
import FormProxyContext from './FormProxyContext';

interface Props {
  children: React.ReactElement | React.ReactElement[];
}

const FormProvider: FC<Props> = (props) => {
  const [result] = useState<ProxyContextValue>(() => ({
    fields: new Map(),
    subscriptions: new Map(),
  }));

  return (
    <FormProxyContext.Provider value={result}>
      {
        props.children
      }
    </FormProxyContext.Provider>
  );
};

export default FormProvider;
