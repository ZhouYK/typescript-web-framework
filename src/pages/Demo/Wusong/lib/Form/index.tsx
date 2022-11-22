import FormProvider from '@/pages/Demo/Wusong/lib/FormProvider';
import useNode from '@/pages/Demo/Wusong/lib/hooks/internal/useNode';
import { FormProps } from '@/pages/Demo/Wusong/lib/interface';
import NodeProvider from '@/pages/Demo/Wusong/lib/NodeProvider';
import nodeHelper from '@/pages/Demo/Wusong/lib/utils/nodeHelper';
import { FC, useEffect } from 'react';

const Form: FC<FormProps> = (props) => {
  const { children, form, ...rest } = props;
  const [formState, formNode] = useNode(rest, 'form', form);
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
};

export default Form;
