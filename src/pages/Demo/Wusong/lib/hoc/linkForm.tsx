import useFormNode from '@/pages/Demo/Wusong/lib/hooks/useFormNode';
import { FormState } from '@/pages/Demo/Wusong/lib/interface';
import NodeProvider from '@/pages/Demo/Wusong/lib/NodeProvider';
import nodeHelper from '@/pages/Demo/Wusong/lib/utils/nodeHelper';
import React, { ComponentType, ForwardRefExoticComponent, useEffect } from 'react';

const linkForm = <P extends { children?: any }, R = any>(component: ComponentType<P> | ForwardRefExoticComponent<P>, mapPropsFromFormModelToComponent: (p: FormState) => P) => {
  return React.memo(React.forwardRef<R, FormState>((props, ref) => {
    const { children, ...rest } = props;
    const Form = component as ComponentType<P>;
    const [formState, formNode] = useFormNode(rest);
    const formProps = mapPropsFromFormModelToComponent(formState);
    // todo 测试，需要删除
    useEffect(() => {
      console.log('formNode', formNode);
      setTimeout(() => {
        console.log('nodeHelper.getValues(formNode);', nodeHelper.getValues(formNode));
      }, 2000);
    }, []);
    // 此处加 field 的 Provider 是为了防止表单下的 field 越过 FieldProvider 访问到了外面的
    // formItem 的 Provider 同理
    return (
        <NodeProvider node={formNode}>
          <Form
            { ...formProps }
            ref={ref}
          >
            {children}
          </Form>
        </NodeProvider>
    );
  }));
};

export default linkForm;
