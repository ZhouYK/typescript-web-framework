import FormItemContext from '@/pages/Demo/Form/lib/FormItemProvider/FormItemContext';
import { FormItemProps } from '@/pages/Demo/Form/lib/interface';
import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import { useDerivedState } from 'femo';
import React, {
  FC, useContext, useRef,
} from 'react';

const FormItem: FC<FormItemProps> = (props) => {
  const { children, onChange } = props;

  const propsRef = useRef(props);
  propsRef.current = props;
  const fieldState = useContext(FormItemContext);
  const fieldNodes = useContext(NodeContext);

  const fieldStateRef = useRef(fieldState);
  fieldStateRef.current = fieldState;

  const [fieldNode] = useDerivedState(() => {
    return fieldNodes?.[0];
  }, [fieldNodes]);

  const fieldNodeRef = useRef(fieldNode);
  fieldNodeRef.current = fieldNode;

  const count = React.Children.count(children);

  const ps = {
    ...children.props,
    value: fieldState?.value ?? '',
    onChange,
  };

  let element: JSX.Element = React.cloneElement(children, ps);
  if (count > 1 || count <= 0) {
    element = (
      <>
        {children}
      </>
    );
  }
  return (
    <section>
      <section>{fieldState.label}</section>
      <section>
        {element}
      </section>
      <section>{fieldState?.errors?.join?.('\n')}</section>
    </section>
  );
};

export default FormItem;
