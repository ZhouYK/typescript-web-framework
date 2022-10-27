import FormProvider from '@/pages/Demo/Foroxy/FormProvider';
import React, {
  ComponentType, ForwardRefExoticComponent, useCallback,
} from 'react';

function useFormProxy<P extends { children?: any; }>(component: ComponentType<P> | ForwardRefExoticComponent<P>) {
  const FinalComponent = useCallback(React.forwardRef<P, P>((props, ref) => {
    const { children, ...rest } = props;
    const Form = component as ComponentType<any>;
    return (
      <FormProvider>
        <Form {...rest} ref={ref}>
          {children}
        </Form>
      </FormProvider>
    );
  }), [component]);

  return [FinalComponent];
}

export default useFormProxy;
