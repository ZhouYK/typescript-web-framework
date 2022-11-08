import { FieldModelProps } from '@/pages/Demo/Wusong/interface';
import { GluerReturn } from 'femo';
import React, { FC } from 'react';
import WuSongFormItemContext from './WuSongFormItemContext';

interface Props {
  children: any;
  field: GluerReturn<FieldModelProps>;
}

const WuSongFormItemProvider: FC<Props> = (props) => (
    <WuSongFormItemContext.Provider value={props.field}>
      {
        props.children
      }
    </WuSongFormItemContext.Provider>
);

export default WuSongFormItemProvider;
