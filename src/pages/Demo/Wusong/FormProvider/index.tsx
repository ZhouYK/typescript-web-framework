import React, { FC, useState } from 'react';
import { WuSongFormContext } from '../interface';
import WuSongFormContextCons from './WuSongFormContext';

interface Props {
  children: React.ReactElement | React.ReactElement[];
}

const FormProvider: FC<Props> = (props) => {
  const [result] = useState<WuSongFormContext>(() => ({
    fields: new Map(),
    subscriptions: new Map(),
  }));

  return (
    <WuSongFormContextCons.Provider value={result}>
      {
        props.children
      }
    </WuSongFormContextCons.Provider>
  );
};

export default FormProvider;
