import { Node } from '@/pages/Demo/Wusong/lib/interface';
import WuSongNodeContext from '@/pages/Demo/Wusong/lib/NodeProvider/WuSongNodeContext';
import React, { FC } from 'react';

interface Props {
  children: any;
  node: Node<any, any>;
}

const NodeProvider: FC<Props> = (props) => {
  return (
    <WuSongNodeContext.Provider value={props.node}>
      {props.children}
    </WuSongNodeContext.Provider>
  );
};

export default NodeProvider;