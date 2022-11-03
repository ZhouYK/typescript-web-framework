import { FieldModelProps } from '@/pages/Demo/Wusong/interface';
import React, { ComponentType, ForwardRefExoticComponent, useCallback } from 'react';

/**
 *
 */

function useFormItem<P extends { children?: any }, R = any>(component: ComponentType<P> | ForwardRefExoticComponent<P>, mapPropsFromModelToComponent: (p: FieldModelProps) => P) {
  const FinalFormItem = useCallback(React.forwardRef<R, FieldModelProps>((props, ref) => {
    const { children, ...rest } = props;
    const FormItem = component as ComponentType<P>;
    const formItemProps = mapPropsFromModelToComponent(rest);
    return (
      <FormItem {...formItemProps} ref={ref}>
        {children}
      </FormItem>
    );
  }), [component]);

  return [FinalFormItem];
}

export default useFormItem;
