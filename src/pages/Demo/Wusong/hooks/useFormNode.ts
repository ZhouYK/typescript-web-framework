import WuSongFormContextCons from '@/pages/Demo/Wusong/FormProvider/WuSongFormContext';
import { FormModelProps, FormNode } from '@/pages/Demo/Wusong/interface';
import nodeHelper from '@/pages/Demo/Wusong/utils/nodeHelper';
import { useIndividualModel } from 'femo';
import { useContext, useEffect, useState } from 'react';

const useFormNode = (initState: FormModelProps):[FormModelProps, FormNode] => {
  const [state, form] = useIndividualModel(initState);

  const parentFormNode = useContext(WuSongFormContextCons);
  const [formNode] = useState<FormNode>(() => {
    const fields = new Map();
    return {
      type: 'form',
      name: state.name,
      instance: {
        model: form,
      },
      fields,
      pushChild: (f) => {
        nodeHelper.chainChild(f, formNode);
      },
      removeChild: (f) => {
        nodeHelper.cutChild(f, formNode);
      },
      pushField: (f) => {
        fields.set(f.name, f);
      },
      removeField: (f) => {
        fields.delete(f.name);
      },
    };
  });

  useEffect(() => {
    parentFormNode?.pushChild(formNode);
    return () => parentFormNode?.removeChild(formNode);
  }, []);
  return [state, formNode];
};

export default useFormNode;
