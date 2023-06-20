import FormProvider from '@/pages/Demo/Form/lib/FormProvider';
import useNode from '@/pages/Demo/Form/lib/hooks/internal/useNode';
import { FormInstance, FormProps } from '@/pages/Demo/Form/lib/interface';
import NodeProvider from '@/pages/Demo/Form/lib/NodeProvider';
import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import nodeHelper from '@/pages/Demo/Form/lib/utils/nodeHelper';
import { useDerivedState } from 'femo';
import {
  FC, forwardRef, useContext, useEffect, useImperativeHandle,
} from 'react';
import { defaultState } from '../config';

const Form: FC<FormProps> = forwardRef<FormInstance, FormProps>((props, ref) => {
  const { children, ...rest } = props;
  const [formState, formNode, instance] = useNode({
    ...defaultState,
    ...rest,
  }, 'form');
  const contextNodes = useContext(NodeContext);

  const [nodes] = useDerivedState(() => {
    return [
      formNode,
      ...(contextNodes || []),
    ];
  }, [formNode, contextNodes]);

  useImperativeHandle(ref, () => {
    return instance;
  });
  useEffect(() => {
    console.log('formNode', formNode);
    setTimeout(() => {
      console.log('nodeHelper.getValues(formNode);', nodeHelper.getValues(formNode));
    }, 8000);
  }, []);
  return (
    <NodeProvider nodes={nodes}>
      <FormProvider formState={formState}>
        <form>
          { children }
        </form>
      </FormProvider>
    </NodeProvider>
  );
});

export default Form;
