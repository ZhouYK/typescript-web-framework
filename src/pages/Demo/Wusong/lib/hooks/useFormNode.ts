import { FNode, FormState } from '@/pages/Demo/Wusong/lib/interface';
import WuSongNodeContext from '@/pages/Demo/Wusong/lib/NodeProvider/WuSongNodeContext';
import nodeHelper from '@/pages/Demo/Wusong/lib/utils/nodeHelper';
import { useDerivedState, useIndividualModel } from 'femo';
import { useContext, useState } from 'react';

const useFormNode = (initState: FormState):[FormState, FNode] => {
  const [state, form] = useIndividualModel(initState);

  const parentNode = useContext(WuSongNodeContext);
  const [formNode] = useState<FNode>(() => {
    return {
      type: 'form',
      name: state.name,
      instance: {
        model: form,
      },
      pushChild: (f: FNode) => {
        nodeHelper.chainChildNode(f, formNode);
      },
      detach: () => {
        nodeHelper.cutNode(formNode);
      },
    };
  });

  useDerivedState(() => {
    parentNode?.pushChild(formNode);
  }, () => {
    formNode.detach();
    parentNode?.pushChild(formNode);
  }, [parentNode]);

  return [state, formNode];
};

export default useFormNode;
