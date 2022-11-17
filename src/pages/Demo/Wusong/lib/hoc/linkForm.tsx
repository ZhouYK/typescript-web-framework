import useFormNode from '@/pages/Demo/Wusong/lib/hooks/useFormNode';
import { FormModelProps } from '@/pages/Demo/Wusong/lib/interface';
import NodeProvider from '@/pages/Demo/Wusong/lib/NodeProvider';
import React, { ComponentType, ForwardRefExoticComponent, useEffect } from 'react';

const linkForm = <P extends { children?: any }, R = any>(component: ComponentType<P> | ForwardRefExoticComponent<P>, mapPropsFromFormModelToComponent: (p: FormModelProps) => P) => {
  return React.memo(React.forwardRef<R, FormModelProps>((props, ref) => {
    const { children, ...rest } = props;
    const Form = component as ComponentType<P>;
    const [formState, formNode] = useFormNode(rest);
    const formProps = mapPropsFromFormModelToComponent(formState);
    // todo 测试，需要删除
    useEffect(() => {
      console.log('formNode', formNode);
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
