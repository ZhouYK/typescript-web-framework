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

// initState 中 name 必须一开始就有，且不允许变更
const useNode = <V>(initState: Partial<FieldState<V> | FormState<V>>, type: NodeType): [NodeStateMap<V>[typeof type], FNode<NodeStateMap<V>[typeof type]>, NodeInstance<NodeStateMap<V>[typeof type]>] => {
  const initStateRef = useRef(initState);
  const reducerRef = useRef(null);
  reducerRef.current = (st: typeof initState) => {
    return {
      ...st,
      ...initState, // 外部传入的属性，控制 model
      name: initStateRef.current.name, // name 不可变
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
  const [node] = useState<FNode<NodeStateMap<V>[typeof type]>>(() => {
    // 如果找到了同层的同名节点，则复用
    const reuseNode = nodeHelper.findNode(parentNode, initStateRef.current?.name);
    if (reuseNode) {
      return reuseNode;
    }
    return {
      type,
      name: '',
      status: 'mount',
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

  // 组件的卸载，则需要判断 preserve 来决定
  // 不需要保存状态，则硬删除节点
  // 需要保存状态，则软删除
  const nodeDetach = () => {
    if (!(node.instance.preserve)) {
      node.detach();
      node.status = 'umount';
      return true;
    }
    node.deleted = true;
    return false;
  };

  const nodePush = (f: FNode) => {
    node.deleted = false;
    if (node.status === 'umount') {
      node.pushChild(f);
      node.status = 'mount';
      return true;
    }
    return false;
  };

  const [state] = useDerivedStateWithModel(node.instance.model, (st) => {
    return {
      ...st,
      ...initState,
    };
  }, [...Object.values(initState || {})]);

  useDerivedState(() => {
    // todo model.silent 更新的属性如果出现在 node 中，也需要同步
    // name 的赋值只会生效一次，因为 name 作为同层节点的唯一标识，不允许改变
    // 并且在初次挂载的时候，会根据 name 来复用 node
    if (!node.name && initStateRef.current?.name) {
      node.name = initStateRef.current?.name;
    }
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
    // 已经是卸载状态的节点，不做挂载操作
    if (node.status === 'umount') return;
    node.detach();
    parentNode?.pushChild(node);
  }, [parentNode]);

  useEffect(() => {
    return () => {
      nodeDetach();
    };
  }, []);

  useEffect(() => {
    // state 控制显示/隐藏
    if (!(state?.visible)) {
      nodeDetach();
      return;
    }
    nodePush(node);
  }, [state?.visible]);

  return [state, node, node.instance];
};

export default useNode;
