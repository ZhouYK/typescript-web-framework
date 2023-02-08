import { FieldState } from '@/pages/Demo/Form/lib/interface';
import React, { FC } from 'react';
import FormItemContext from './FormItemContext';

interface Props {
  children: any;
  fieldState: FieldState;
}

const WuSongFormItemProvider: FC<Props> = (props) => {
  return (
    <FormItemContext.Provider value={props.fieldState}>
      {
        props.children
      }
    </FormItemContext.Provider>
  );
};

export default WuSongFormItemProvider;
