import { FNode } from '@/pages/Demo/Form/lib/interface';
import React from 'react';

const NodeContext = React.createContext<FNode[]>([]);

export default NodeContext;
