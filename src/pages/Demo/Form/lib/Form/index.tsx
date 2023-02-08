import FormProvider from '@/pages/Demo/Form/lib/FormProvider';
import useNode from '@/pages/Demo/Form/lib/hooks/internal/useNode';
import { FormProps } from '@/pages/Demo/Form/lib/interface';
import NodeProvider from '@/pages/Demo/Form/lib/NodeProvider';
import nodeHelper from '@/pages/Demo/Form/lib/utils/nodeHelper';
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
