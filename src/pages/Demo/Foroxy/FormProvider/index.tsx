import React, { FC, useState } from 'react';
import { ProxyContextValue } from '../interface';
import FormProxyContext from '../context/FormProxyContext';

interface Props {
  children: React.ReactElement | React.ReactElement[];
}

const FormProvider: FC<Props> = (props) => {
  const [fields] = useState<ProxyContextValue>(() => new Map());

  return (
    <FormProxyContext.Provider value={fields}>
      {
        props.children
      }
    </FormProxyContext.Provider>
  );
};

export default FormProvider;
