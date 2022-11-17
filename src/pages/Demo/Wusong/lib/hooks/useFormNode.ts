import { FormModelProps, FormNode } from '@/pages/Demo/Wusong/lib/interface';
import WuSongNodeContext from '@/pages/Demo/Wusong/lib/NodeProvider/WuSongNodeContext';
import nodeHelper from '@/pages/Demo/Wusong/lib/utils/nodeHelper';
import { useIndividualModel } from 'femo';
import { useContext, useEffect, useState } from 'react';

const useFormNode = (initState: FormModelProps):[FormModelProps, FormNode] => {
  const [state, form] = useIndividualModel(initState);

  const parentNode = useContext(WuSongNodeContext);
  const [formNode] = useState<FormNode>(() => {
    return {
      type: 'form',
      name: state.name,
      instance: {
        model: form,
      },
      pushChild: (f) => {
        nodeHelper.chainChild(f, formNode);
      },
      removeChild: (f) => {
        nodeHelper.cutChild(f, formNode);
      },
    };
  });

  useEffect(() => {
    parentNode?.pushChild(formNode);
    return () => parentNode?.removeChild(formNode);
  }, [parentNode]);
  return [state, formNode];
};

export default useFormNode;
