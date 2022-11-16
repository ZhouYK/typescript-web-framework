import WuSongFormItemProvider from '@/pages/Demo/Wusong/FormItemProvider';
import useFieldNode from '@/pages/Demo/Wusong/hooks/useFieldNode';
import { FieldModelProps } from '@/pages/Demo/Wusong/interface';
import NodeProvider from '@/pages/Demo/Wusong/NodeProvider';
import React, { ComponentType, ForwardRefExoticComponent } from 'react';

const linkField = <P, R>(component: ComponentType<P> | ForwardRefExoticComponent<P>) => React.memo(React.forwardRef<R, FieldModelProps>((props, ref) => {
  const [fieldState, fieldNode] = useFieldNode(props);
  const Component = component;
  return (
    <NodeProvider node={fieldNode}>
      <WuSongFormItemProvider fieldState={fieldState}>
        {/* @ts-ignore */}
        <Component ref={ref} { ...fieldState } />
      </WuSongFormItemProvider>
    </NodeProvider>
  );
}));

export default linkField;
