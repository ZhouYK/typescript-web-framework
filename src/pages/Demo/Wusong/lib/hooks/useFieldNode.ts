import WuSongNodeContext from '@/pages/Demo/Wusong/lib/NodeProvider/WuSongNodeContext';
import nodeHelper from '@/pages/Demo/Wusong/lib/utils/nodeHelper';
import { useDerivedState, useIndividualModel } from 'femo';
import {
  useContext, useState,
} from 'react';
import { FieldModelProps, FNode } from '../interface';

const useFieldNode = <V>(initState: FieldModelProps<V>): [FieldModelProps<V>, FNode<FieldModelProps<V>>] => {
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

  const [fieldNode] = useState<FNode<FieldModelProps<V>>>(() => {
    return {
      type: 'field',
      name: state.name,
      instance: {
        model: field,
      },
      pushChild: (f: FNode) => {
        nodeHelper.chainNode(f, fieldNode);
      },
      removeChild: (f: FNode) => {
        nodeHelper.cutNode(f, fieldNode);
      },
    };
  });
  useDerivedState(() => {
    if (parentNode) {
      parentNode.pushChild(fieldNode);
      return () => parentNode.removeChild(fieldNode);
    }
    return null;
  }, [parentNode]);

  return [state, fieldNode];
};

export default useFieldNode;
