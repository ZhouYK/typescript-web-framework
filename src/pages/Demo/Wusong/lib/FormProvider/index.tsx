import { FormState } from '@/pages/Demo/Wusong/lib/interface';
import React, { FC } from 'react';
import FormContext from './FormContext';

interface Props {
  children: any;
  formState: FormState;
}

const WuSongFormItemProvider: FC<Props> = (props) => {
  return (
    <FormContext.Provider value={props.formState}>
      {
        props.children
      }
    </FormContext.Provider>
  );
};

export default WuSongFormItemProvider;
