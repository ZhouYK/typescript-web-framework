import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import instanceHelper from '@/pages/Demo/Form/lib/utils/instanceHelper';
import nodeHelper from '@/pages/Demo/Form/lib/utils/nodeHelper';
import {
  gluer, unsubscribe, useDerivedState, useDerivedStateWithModel,
} from 'femo';
import {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import {
  FieldInstance, FieldState, FNode, FormState, NodeInstance, NodeStateMap, NodeStatusEnum, NodeType,
} from '../../interface';

// initState 中 name 必填 TODO 需要做校验
const useNode = <V>(initState: Partial<FieldState<V> | FormState<V>>, type: NodeType): [NodeStateMap<V>[typeof type], FNode<NodeStateMap<V>[typeof type]>, NodeInstance<NodeStateMap<V>[typeof type]>] => {
  const [, refresh] = useState(null);
  const listenersRef = useRef([]);
  const reducerRef = useRef(null);
  reducerRef.current = (st: typeof initState) => {
    return {
      ...st,
      ...initState, // 外部传入的属性，控制 model
    };
  };

  const reducer = useCallback((s: typeof initState) => {
    return reducerRef.current(s);
  }, []);

  const [instance] = useState(() => {
    return instanceHelper.createInstance(initState, reducer);
  });
  const insRef = useRef(instance);

  const parentNode = useContext(NodeContext);

  const findSameNameSiblingNode = (n: string) => nodeHelper.findNode(parentNode, n);

  const [node] = useState<FNode<NodeStateMap<V>[typeof type]>>(() => {
    // 如果找到了同层的同名节点，则复用
    const reuseNode = findSameNameSiblingNode(initState.name);
    if (reuseNode) {
      return reuseNode;
    }
    return {
      type,
      name: initState.name,
      status: gluer<NodeStatusEnum>(NodeStatusEnum.mount),
      deleted: false,
      instance: insRef.current,
      pushChild: (f: FNode) => {
        nodeHelper.chainChildNode(f, node);
      },
      detach: () => {
        nodeHelper.cutNode(node);
      },
    };
  });

  // 节点卸载只能走这个方法
  const nodeDetach = (callback?: () => void) => {
    // 只要保留状态，那么节点就只做软删除，不做卸载
    if (node.instance.preserve) {
      node.deleted = true;
      return;
    }
    node.detach();
    // 走异步，避免副作用告警
    node.status.race(() => Promise.resolve(NodeStatusEnum.unmount)).then(() => {
      unsubscribe([node.status]);
    });
    // 卸载过后，解绑所有监听
    unsubscribe([node.instance.model]);
    // 补充执行函数
    callback?.();
  };

  const pushChild = (changeStatus = true) => {
    parentNode?.pushChild(node);
    // 每次挂载 node 过后，都往上寻找需要该节点的 context node，并执行触发 rerender 的动作
    console.log('backtrackForContextNode', node.name);
    nodeHelper.backtrackForContextNode(node);
    if (changeStatus) {
      node.status.race(() => Promise.resolve(NodeStatusEnum.mount));
    }
    dealWithSameNameNode(node.name);
  };

  const nodePush = () => {
    node.deleted = false;
    // 出现 unmount 节点只可能有两种可能：
    // 1. 组件节点卸载 2. visible 为 false，且 preserve 为 false
    // 情况 1，unmount 的节点不会在一个组件里面出现，因为组件已经卸载了，不存在执行环境了
    // 情况 2，unmount 的节点则可能出现在同一个组件中，当组件 visible 变为 true 时，则会重入节点。
    // 下面的情况属于 情况 2
    if (node.status() === NodeStatusEnum.unmount) {
      if (!node.instance.preserve) {
        node.instance.model((state) => ({
          ...state,
          value: undefined,
          errors: [],
          validateStatus: 'default',
        }));
      }
      pushChild();
      return true;
    }
    return false;
  };

  const dealWithSameNameNode = (n: string) => {
    const sameNameNode = findSameNameSiblingNode(n);
    if (sameNameNode && !Object.is(sameNameNode, node)) {
      listenersRef.current.forEach((fn) => {
        fn?.();
      });
      listenersRef.current = [];
      // 同步状态
      node.instance.model(sameNameNode.instance.model());
      const listener_1 = node.instance.model.onChange((state) => {
        sameNameNode.instance.model(state);
      });
      const listener_2 = sameNameNode.instance.model.onChange((state) => {
        node.instance.model(state);
      });
      listenersRef.current.push(listener_1, listener_2);
    }
  };

  const [state] = useDerivedStateWithModel(node.instance.model, (st) => {
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
        if (nodeHelper.isForm(n.type) || n.deleted) {
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
    pushChild();
  }, () => {
    // 已经是卸载状态的节点，不做挂载操作
    if (node.status() === NodeStatusEnum.unmount) return;
    node.detach();
    node.status.silent(NodeStatusEnum.unmount);
    pushChild();
  }, [parentNode]);

  useDerivedState(() => {
    // state 控制显示/隐藏
    if (!(state?.visible)) {
      // 可能会把所有 node.instance.model 上的监听都解绑
      // 需要保持当前 useNode 里面有监听
      nodeDetach(() => {
        node.instance.model.onChange(() => {
          refresh({});
        });
      });
      return;
    }
    nodePush();
  }, [state?.visible]);

  useEffect(() => {
    return () => {
      nodeDetach();
    };
  }, []);

  return [state, node, node.instance];
};

export default useNode;
