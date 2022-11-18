import WuSongFormItemProvider from '@/pages/Demo/Wusong/lib/FormItemProvider';
import useFieldNode from '@/pages/Demo/Wusong/lib/hooks/useFieldNode';
import { FieldState } from '@/pages/Demo/Wusong/lib/interface';
import NodeProvider from '@/pages/Demo/Wusong/lib/NodeProvider';
import React, { ComponentType, ForwardRefExoticComponent } from 'react';

function linkField <R>(component: ComponentType<Partial<FieldState>> | ForwardRefExoticComponent<Partial<FieldState>>): typeof component {
  return React.memo(React.forwardRef<R, FieldState>((props, ref) => {
    // todo 外部传入的 props 要与 fieldState 做融合
    const [fieldState, fieldNode] = useFieldNode(props);
    const Component = component;
    console.log('fieldState', fieldState.value);
    return (
      <NodeProvider node={fieldNode}>
        <WuSongFormItemProvider fieldState={fieldState}>
          {/* @ts-ignore */}
          <Component ref={ref} { ...fieldState } />
        </WuSongFormItemProvider>
      </NodeProvider>
    );
  }));
}

export default linkField;
