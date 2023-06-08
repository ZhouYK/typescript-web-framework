import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import instanceHelper from '@/pages/Demo/Form/lib/utils/instanceHelper';
import nodeHelper from '@/pages/Demo/Form/lib/utils/nodeHelper';
import { useDerivedState, useDerivedStateWithModel } from 'femo';
import {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  FieldInstance,
  FieldState, FNode, FormState, NodeInstance, NodeStateMap, NodeType,
} from '../../interface';

// todo 需要一个默认的 fieldState 和 formState
const useNode = <V>(initState: Partial<FieldState<V> | FormState<V>>, type: NodeType): [NodeStateMap<V>[typeof type], FNode<NodeStateMap<V>[typeof type]>, NodeInstance<NodeStateMap<V>[typeof type]>] => {
  const reducerRef = useRef(null);
  reducerRef.current = (st: typeof initState) => {
    return {
      ...st,
      ...initState,
    };
  };

  const reducer = useCallback((s: typeof initState) => {
    return reducerRef.current(s);
  }, []);

  const [instance] = useState(() => {
    return instanceHelper.createInstance(initState, reducer);
  });
  const insRef = useRef(instance);

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
    // 这里 state 中不能有名为 model 和 validate 的属性，因为这个是 instance 的保留属性名
    Object.assign(node.instance, state);
    node.instance.validate = async () => {
      const formNode = nodeHelper.findNearlyParentFormNode(node);
      const errors: Promise<any>[] = [];
      nodeHelper.inspect(node, (n) => {
        if (nodeHelper.isForm(n.type)) {
          return true;
        }
        const error = (n.instance as FieldInstance<V>)?.validator?.(n.instance.value, n.instance, formNode?.instance);

        const errorPromise = Promise.resolve(error).then((e) => {
          return e;
        }).catch((err) => {
          return err;
        });
        errors.push(errorPromise);

        n.instance.model.race((s) => {
          return errorPromise.then((res) => {
            if (!res && !(s?.errors?.length)) return s;
            if (!res) {
              return ({
                ...s,
                errors: [],
              });
            }
            return {
              ...s,
              errors: [res],
            };
          });
        });
        return true;
      });

      return Promise.all(errors).then((errs) => {
        if (errs.every((er) => !er)) {
          return nodeHelper.getValues(node);
        }
        return Promise.reject(errs);
      });
    };
  }, [state]);

  useDerivedState(() => {
    parentNode?.pushChild(node);
  }, () => {
    node.detach();
    parentNode?.pushChild(node);
  }, [parentNode]);

  useEffect(() => {
    return () => {
      // 如果节点是不保存状态，则卸载掉节点
      if (!(node.instance.preserve)) {
        node.detach();
      }
    };
  }, []);

  useEffect(() => {
    // 隐藏字段时
    if (!(state?.visible)) {
      // 不保存状态，则卸载掉节点
      if (!(state?.preserve)) {
        node.detach();
      }
    }
  }, [state?.visible]);

  return [state, node, insRef.current];
};

export default useNode;
