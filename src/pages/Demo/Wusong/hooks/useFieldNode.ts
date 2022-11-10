import WuSongFormItemContext from '@/pages/Demo/Wusong/FormItemProvider/WuSongFormItemContext';
import WuSongFormContextCons from '@/pages/Demo/Wusong/FormProvider/WuSongFormContext';
import nodeHelper from '@/pages/Demo/Wusong/utils/nodeHelper';
import { useIndividualModel } from 'femo';
import {
  useContext, useEffect, useState,
} from 'react';
import { FieldModelProps, FieldNode } from '../interface';

const useFieldNode = <V>(initState: FieldModelProps<V>): [FieldModelProps<V>, FieldNode] => {
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

  const parentFieldNode = useContext(WuSongFormItemContext);
  const parentFormNode = useContext(WuSongFormContextCons);

  const [fieldNode] = useState<FieldNode>(() => {
    return {
      type: 'field',
      name: state.name,
      instance: {
        model: field,
      },
      pushChild: (f: FieldNode) => {
        nodeHelper.chainChild(f, fieldNode);
      },
      removeChild: (f: FieldNode) => {
        nodeHelper.cutChild(f, fieldNode);
      },
    };
  });

  useEffect(() => {
    if (parentFieldNode) {
      parentFieldNode.pushChild(fieldNode);
      return () => parentFieldNode.removeChild(fieldNode);
    }
    if (parentFormNode) {
      parentFormNode.pushField(fieldNode);
      return () => parentFormNode.removeField(fieldNode);
    }
    return null;
  }, []);
  return [state, fieldNode];
};

export default useFieldNode;
