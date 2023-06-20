import { FNode } from '@/pages/Demo/Form/lib/interface';
import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import React, { FC } from 'react';

interface Props {
  children: any;
  nodes: FNode[];
}

const NodeProvider: FC<Props> = (props) => {
  return (
    <NodeContext.Provider value={props.nodes}>
      {props.children}
    </NodeContext.Provider>
  );
};

export default NodeProvider;
