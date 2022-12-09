import NodeContext from '@/pages/Demo/Wusong/lib/NodeProvider/NodeContext';
import instanceHelper from '@/pages/Demo/Wusong/lib/utils/instanceHelper';
import nodeHelper from '@/pages/Demo/Wusong/lib/utils/nodeHelper';
import { useDerivedState, useDerivedStateWithModel } from 'femo';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  FieldInstance,
  FieldState, FNode, FormState, NodeInstance, NodeStateMap, NodeType,
} from '../../interface';

// todo 需要一个默认的 fieldState 和 formState
const useNode = <V>(initState: Partial<FieldState<V> | FormState<V>>, type: NodeType, instance?: NodeInstance<NodeStateMap<V>[typeof type]>): [NodeStateMap<V>[typeof type], FNode<NodeStateMap<V>[typeof type]>] => {
  const insRef = useRef(instance || instanceHelper.createInstance(initState));

  // const context = useContext(WuSongFormContextCons);
  // @ts-ignore
  // eslint-disable-next-line consistent-return
  // useEffect(() => {
  //   if (typeof state.name === 'string' && state.name) {
  //     context.fields.set(state.name, field);
  //     if (context.subscriptions.has(state.name)) {
  //       context.subscriptions.get(state.name).forEach((callback) => callback(field));
  //     }
  //     return () => {
  //       context.fields.delete(state.name);
  //       if (context.subscriptions.has(state.name)) {
  //         context.subscriptions.get(state.name).forEach((callback) => callback(null));
  //       }
  //     };
  //   }
  // }, [state.name]);

  const parentNode = useContext(NodeContext);

  const [node] = useState<FNode<NodeStateMap<V>[typeof type]>>(() => {
    return {
      type,
      name: '',
      instance: insRef.current,
      pushChild: (f: FNode) => {
        nodeHelper.chainChildNode(f, node);
      },
      detach: () => {
        nodeHelper.cutNode(node);
      },
    };
  });

  const [state] = useDerivedStateWithModel(insRef.current.model, (st) => {
    return {
      ...st,
      ...initState,
    };
  }, [...Object.values(initState || {})]);

  useDerivedState(() => {
    // todo model.silent 更新的属性如果出现在 node 中，也需要同步
    node.name = state.name;
    // 保持 instance 的引用不变很重要
    Object.assign(node.instance, state);
    node.instance.validate = async () => {
      const formNode = nodeHelper.findNearlyParentFormNode(node);
      const errors: string[] = [];
      nodeHelper.inspect(node, (n) => {
        const error = (n.instance as FieldInstance<V>)?.validator?.(n.instance.value, n.instance, formNode.instance);
        if (error) {
          errors.push(error);
        }
        return true;
      });
      if (errors.length) {
        return Promise.reject(errors);
      }
      return nodeHelper.getValues(node);
    };
  }, [state]);

  useDerivedState(() => {
    parentNode?.pushChild(node);
  }, () => {
    node.detach();
    parentNode?.pushChild(node);
  }, [parentNode]);

  useEffect(() => {
    return () => node.detach();
  }, []);

  return [state, node];
};

export default useNode;
