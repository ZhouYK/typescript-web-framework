import WuSongNodeContext from '@/pages/Demo/Wusong/lib/NodeProvider/WuSongNodeContext';
import nodeHelper from '@/pages/Demo/Wusong/lib/utils/nodeHelper';
import { useDerivedState, useIndividualModel } from 'femo';
import {
  useContext, useEffect, useState,
} from 'react';
import { FieldState, FNode } from '../interface';

const useFieldNode = <V>(initState: FieldState<V>): [FieldState<V>, FNode<FieldState<V>>] => {
  const [state, field] = useIndividualModel(initState);
  // const context = useContext(WuSongFormContextCons);
  // @ts-ignore
  // eslint-disable-next-line consistent-return
  // useEffect(() => {
  //   if (typeof state.name === 'string' && state.name) {
  //     context.fields.set(state.name, field);
  //     if (context.subscriptions.has(state.name)) {
  //       context.subscriptions.get(state.name).forEach((callback) => callback(field));
  //     }
  //     return () => {
  //       context.fields.delete(state.name);
  //       if (context.subscriptions.has(state.name)) {
  //         context.subscriptions.get(state.name).forEach((callback) => callback(null));
  //       }
  //     };
  //   }
  // }, [state.name]);

  const parentNode = useContext(WuSongNodeContext);

  const [fieldNode] = useState<FNode<FieldState<V>>>(() => {
    return {
      type: 'field',
      name: state.name,
      instance: {
        model: field,
      },
      pushChild: (f: FNode) => {
        nodeHelper.chainChildNode(f, fieldNode);
      },
      detach: () => {
        nodeHelper.cutNode(fieldNode);
      },
    };
  });

  useDerivedState(() => {
    parentNode.pushChild(fieldNode);
  }, () => {
    fieldNode.detach();
    parentNode.pushChild(fieldNode);
  }, [parentNode]);

  useEffect(() => {
    return () => fieldNode.detach();
  }, []);

  return [state, fieldNode];
};

export default useFieldNode;
