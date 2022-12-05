import { FNode } from '@/pages/Demo/Wusong/lib/interface';
import NodeContext from '@/pages/Demo/Wusong/lib/NodeProvider/NodeContext';
import React, { FC } from 'react';

interface Props {
  children: any;
  node: FNode;
}

const NodeProvider: FC<Props> = (props) => {
  return (
    <NodeContext.Provider value={props.node}>
      {props.children}
    </NodeContext.Provider>
  );
};

export default NodeProvider;
