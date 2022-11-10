import WuSongFormItemProvider from '@/pages/Demo/Wusong/FormItemProvider';
import FormProvider from '@/pages/Demo/Wusong/FormProvider';
import useFormNode from '@/pages/Demo/Wusong/hooks/useFormNode';
import { FormModelProps } from '@/pages/Demo/Wusong/interface';
import React, { ComponentType, ForwardRefExoticComponent, useEffect } from 'react';

const linkForm = <P extends { children?: any }, R = any>(component: ComponentType<P> | ForwardRefExoticComponent<P>, mapPropsFromFormModelToComponent: (p: FormModelProps) => P) => {
  return React.memo(React.forwardRef<R, FormModelProps>((props, ref) => {
    const { children, ...rest } = props;
    const Form = component as ComponentType<P>;
    const [formState, formNode] = useFormNode(rest);
    const formProps = mapPropsFromFormModelToComponent(formState);
    // todo 测试，需要删除
    useEffect(() => {
      console.log('formNode', Array.from(formNode.fields.values()));
    }, []);
    // 此处加 FormItem 的 Provider 是为了防止表单下的 FormItem 越过 FormProvider 访问到了外面的
    return (
      <FormProvider formNode={formNode}>
        <WuSongFormItemProvider fieldNode={null}>
          <Form
            { ...formProps }
            ref={ref}
          >
            {children}
          </Form>
        </WuSongFormItemProvider>
      </FormProvider>
    );
  }));
};

export default linkForm;
