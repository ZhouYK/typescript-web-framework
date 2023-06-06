import FormProvider from '@/pages/Demo/Form/lib/FormProvider';
import useNode from '@/pages/Demo/Form/lib/hooks/internal/useNode';
import { FormInstance, FormProps } from '@/pages/Demo/Form/lib/interface';
import NodeProvider from '@/pages/Demo/Form/lib/NodeProvider';
import nodeHelper from '@/pages/Demo/Form/lib/utils/nodeHelper';
import {
  FC, forwardRef, useEffect, useImperativeHandle,
} from 'react';

const Form: FC<FormProps> = forwardRef<FormInstance, FormProps>((props, ref) => {
  const { children, form, ...rest } = props;
  const [formState, formNode, instance] = useNode(rest, 'form', form);

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
    <NodeProvider node={formNode}>
      <FormProvider formState={formState}>
        <form>
          { children }
        </form>
      </FormProvider>
    </NodeProvider>
  );
});

export default Form;
