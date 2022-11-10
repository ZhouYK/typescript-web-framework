import { FieldNode } from '@/pages/Demo/Wusong/interface';
import React, { FC } from 'react';
import WuSongFormItemContext from './WuSongFormItemContext';

interface Props {
  children: any;
  fieldNode: FieldNode;
}

const WuSongFormItemProvider: FC<Props> = (props) => (
    <WuSongFormItemContext.Provider value={props.fieldNode}>
      {
        props.children
      }
    </WuSongFormItemContext.Provider>
);

export default WuSongFormItemProvider;
