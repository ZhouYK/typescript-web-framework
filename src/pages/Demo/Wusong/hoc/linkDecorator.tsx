import WuSongFormItemProvider from '@/pages/Demo/Wusong/FormItemProvider';
import useFieldModel from '@/pages/Demo/Wusong/hooks/useFieldModel';
import { FieldModelProps } from '@/pages/Demo/Wusong/interface';
import React, { ComponentType, ForwardRefExoticComponent } from 'react';

const linkDecorator = <P extends { children?: any }, R = any>(component: ComponentType<P> | ForwardRefExoticComponent<P>, mapPropsFromModelToComponent: (p: FieldModelProps) => P) => React.memo(React.forwardRef<R, FieldModelProps>((props, ref) => {
  const { children, ...rest } = props;
  const FormItem = component as ComponentType<P>;
  const [fieldState, fieldModel] = useFieldModel(rest);
  const formItemProps = mapPropsFromModelToComponent(fieldState);
  return (
    <FormItem {...formItemProps} ref={ref}>
      <WuSongFormItemProvider field={fieldModel}>
        {children}
      </WuSongFormItemProvider>
    </FormItem>
  );
}));

export default linkDecorator;
