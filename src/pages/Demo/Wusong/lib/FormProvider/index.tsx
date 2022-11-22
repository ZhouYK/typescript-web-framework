import { FormState } from '@/pages/Demo/Wusong/lib/interface';
import React, { FC } from 'react';
import WuSongFormContext from './WuSongFormContext';

interface Props {
  children: any;
  formState: FormState;
}

const WuSongFormItemProvider: FC<Props> = (props) => {
  return (
    <WuSongFormContext.Provider value={props.formState}>
      {
        props.children
      }
    </WuSongFormContext.Provider>
  );
};

export default WuSongFormItemProvider;
