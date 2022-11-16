import { FieldModelProps } from '@/pages/Demo/Wusong/interface';
import React, { FC } from 'react';
import WuSongFormItemContext from './WuSongFormItemContext';

interface Props {
  children: any;
  fieldState: FieldModelProps;
}

const WuSongFormItemProvider: FC<Props> = (props) => {
  return (
    <WuSongFormItemContext.Provider value={props.fieldState}>
      {
        props.children
      }
    </WuSongFormItemContext.Provider>
  );
};

export default WuSongFormItemProvider;
