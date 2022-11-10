import React, { FC } from 'react';
import { FormNode } from '../interface';
import WuSongFormContextCons from './WuSongFormContext';

interface Props {
  children: React.ReactElement | React.ReactElement[];
  formNode: FormNode;
}

const FormProvider: FC<Props> = (props) => {
  return (
    <WuSongFormContextCons.Provider value={props.formNode}>
      {
        props.children
      }
    </WuSongFormContextCons.Provider>
  );
};

export default FormProvider;
