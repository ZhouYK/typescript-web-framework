import { defaultState } from '@/pages/Demo/Form/lib/config';
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
  FieldInstance, FieldState, FNode, FormState, NodeStateMap, NodeStatusEnum, NodeType, NodeValueType, SearchAction,
} from '../../interface';
import hooksHelper from '../helper';

const useNode = <V>(initState: Partial<FieldState<V> | FormState<V>>, type: NodeType): [NodeStateMap<V>[typeof type], FNode<NodeStateMap<V>[typeof type]>] => {
  // 受控 props 更新 model 时需要发出更新通知的 key，避免降低使用时的心智负担，因为 props 中可能会出现 函数、对象 的直接量，导致每次 render 都会去更新 model并发出通知， 从而导致一些不预测的问题
  // 只有 needSyncPropKeys 中出现的 key 更新了值才会去触发 model 的通知，而其他的 props 更新则会是静默更新
  const {
    // @ts-ignore
    label,
    value,
    visible,
    preserve,
    name,
    ...restInitState
  } = initState;

  const initStateRef = useRef(initState);
  initStateRef.current = initState;

  const controlledKeysRef = useRef<Set<string>>();
  controlledKeysRef.current = new Set(Object.keys(initState));

  const [positiveUpdateFlag] = useState(() => {
    return `______positive${Date.now()}UpdateFlag______`;
  });

  const firstRenderRef = useRef(true);
  const listenersRef = useRef([]);
  const reducerRef = useRef(null);

  const reducer = useCallback((s: typeof initState) => {
    return reducerRef.current(s);
  }, []);

  const [instance] = useState(() => {
    return instanceHelper.createInstance({ ...defaultState, ...initState }, reducer);
  });
  const insRef = useRef(instance);

  reducerRef.current = (st: typeof initState) => {
    const curState = insRef.current?.model();
    // 如果 state 没有变化，则不合并
    if (Object.is(st, curState)) return st;

    // 如果来源于 useDerivedStateWithModel 更新（受控属性更新），则直接返回。
    // 因为这个就是最终的值
    // @ts-ignore
    if (st?.[positiveUpdateFlag]) {
      // @ts-ignore
      delete st[positiveUpdateFlag];
      return st;
    }
    // 其他的更新
    let isAllControlled = true;
    const tmpSt = { ...st };
    // 其他的更新，需要将受控属性的更新无效化
    Object.keys(curState || {}).forEach((key) => {
      const curValue = curState[key];
      // 下一个 state 里面有 key
      if (key in st) {
        delete tmpSt[key];
        const nextValue = st[key];
        // 下一个 state 里面对应的值不相等
        if (!Object.is(curValue, nextValue)) {
          // key 是受控属性
          if (controlledKeysRef.current.has(key)) {
            // 受控属性不能改变
            st[key] = initStateRef.current[key];
          } else if (isAllControlled) {
            // key 不是受控属性
            isAllControlled = false;
          }
        }
        return;
      }
      // 下一个 state 里面没有 key
      // key 是受控属性
      if (controlledKeysRef.current.has(key)) {
        st[key] = initStateRef.current[key];
      } else if (isAllControlled) {
        // key 不是受控属性
        isAllControlled = false;
      }
    });

    // 与 curState 比较完过后，st 里面可能还有多余的属性
    Object.keys(tmpSt).forEach((key) => {
      // 多余的属性是受控的，则不改变
      if (controlledKeysRef.current.has(key)) {
        st[key] = initStateRef.current[key];
      } else if (isAllControlled) {
        // key 不是受控属性
        isAllControlled = false;
      }
    });

    if (!isAllControlled) {
      return st;
    }
    return curState;
  };

  const parentNodes = useContext(NodeContext);
  const [parentNode] = useDerivedState(() => {
    return parentNodes?.[0];
  }, [parentNodes]);

  const [sameNameSiblingNodeParentNode] = useDerivedState(() => {
    const target = parentNodes.find((n) => {
      return !nodeHelper.isAnonymous(n.name);
    });
    return target || parentNodes[parentNodes.length - 1];
  }, [parentNodes]);

  // 这里查找同层同名的节点，在加入匿名节点后可能会出现：同名节点不在同一个物理层。
  // 这个时候就可能出现查找的时候节点还没有挂载的情况，出现这种情况一定是：两个节点都在挂载中，挂载完成时间会有先后，那么肯定有一个节点挂载的时候，能找到另一个的。
  // 还需要注意，这里的 parentNode 应该向上寻找第一个非匿名节点或者全是匿名节点的情况下找最顶层节点。
  const findSameNameSiblingNode = (n: string) => nodeHelper.findFieldNodes(sameNameSiblingNodeParentNode, n);

  const setNodeValueType = (pn: FNode, child: FNode) => {
    // form 节点的值不参加判断
    // 获取值那 form 节点不参与生成
    if (nodeHelper.isForm(child.type)) return;
    switch (pn?.valueType) {
      case NodeValueType.init: {
        if (nodeHelper.isNumber(child.name)) {
          pn.valueType = NodeValueType.array;
        } else if (nodeHelper.isAnonymous(child.name)) {
          // 匿名字段用字段的类型来判断父节点类型
          switch (child.valueType) {
            case NodeValueType.object:
              pn.valueType = NodeValueType.object;
              break;
            case NodeValueType.array:
              pn.valueType = NodeValueType.array;
              break;
            case NodeValueType.init:
            default:
          }
        } else {
          pn.valueType = NodeValueType.object;
        }
      }
        break;
      case NodeValueType.array: {
        // 匿名字段用字段的类型来判断父节点类型
        if (nodeHelper.isAnonymous(child.name)) {
          switch (child.valueType) {
            case NodeValueType.object:
              pn.valueType = NodeValueType.object;
              break;
            case NodeValueType.init:
            case NodeValueType.array:
            default:
          }
        } else if (!nodeHelper.isNumber(child.name)) {
          pn.valueType = NodeValueType.object;
        }
      }
        break;
      case NodeValueType.object:
      default:
    }
  };

  const [node] = useState<FNode<NodeStateMap<V>[typeof type]>>(() => {
    return {
      type,
      name: initState.name,
      status: gluer<NodeStatusEnum>(NodeStatusEnum.init),
      deleted: false,
      valueType: NodeValueType.init,
      instance: insRef.current,
      pushChild: (f: FNode) => {
        nodeHelper.chainChildNode(f, node);
        setNodeValueType(node, f);
      },
      detach: () => {
        const { parent } = node;
        nodeHelper.cutNode(node);
        // 从链表脱落过后，节点的 valueType 回到初始状态
        node.valueType = NodeValueType.init;
        // 链表脱落过后，需要检查父节点的 valueType
        if (parent && !parent?.child) {
          parent.valueType = NodeValueType.init;
        }
      },
    };
  });

  // 每个调用了 node.detach 的地方都应该调用一次该方法
  const resetSameNameNodeListeners = useCallback(() => {
    listenersRef.current.forEach((fn) => {
      fn?.();
    });
    listenersRef.current = [];
  }, []);

  const noticeSubscriber = (action: SearchAction) => {
    let index = 0;
    let parent = parentNodes[index];
    // 匿名节点不会有任何关系
    if (nodeHelper.isAnonymous(node.name)) {
      return;
    }
    const path = [node.name];
    while (parent) {
      // 非表单匿名字段需要跳过
      if (nodeHelper.isAnonymous(parent.name) && !nodeHelper.isForm(parent.type)) {
        index += 1;
        parent = parentNodes[index];
        continue;
      }
      const tmpPath = JSON.stringify(path);
      // eslint-disable-next-line no-loop-func
      parent?.searchingPath?.forEach((value, key) => {
        if (value.has(tmpPath)) {
          key?.(node, tmpPath, action);
        }
      });
      path.unshift(parent.name);
      // form 节点处理完成后就不再追溯了
      if (nodeHelper.isForm(parent?.type)) {
        break;
      }
      index += 1;
      parent = parentNodes[index];
    }
  };

  const pushChild = () => {
    parentNode?.pushChild(node);
    node.status.race(NodeStatusEnum.mount);
    // 每次挂载 node 过后，都往上寻找需要该节点的 context node，并执行触发 rerender 的动作
    noticeSubscriber(SearchAction.node_position_change);
    if (nodeHelper.isAnonymous(node.name)) return;
    dealWithSameNameNode(node.name);
  };

  const nodeDetach = () => {
    node.detach();
    // 先通知
    node.status.race(NodeStatusEnum.unmount);
    resetSameNameNodeListeners();
  };

  // （visible 引起的） 或者 （组件本身卸载引起的） 节点卸载只能走这个方法
  const visibleOrUnmountNodeDetach = (shouldOff = true) => {
    // 只要保留状态，那么节点就只做软删除，不做卸载
    // 卸载时 preserve 决定了 node 是否从链表中删除
    // 为什么这么设计？
    // 主要考虑到（preserve 为 true 时，保留节点状态与保留节点在链表以及 preserve 为 false 时，初始化节点状态与从链表中删除节点）语义上一致性很强
    if (node.instance.preserve) {
      node.deleted = true;
      return;
    }
    nodeDetach();
    if (shouldOff) {
      // 卸载过后，解绑所有监听
      unsubscribe([node.instance.model]);
    }
    if (shouldOff) {
      unsubscribe([node.status]);
    }
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
        // TODO 这里重置的状态可能需要调整
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
    const sameNameNodes = findSameNameSiblingNode(n);
    if (sameNameNodes.length > 1 || (sameNameNodes.length === 1 && !Object.is(sameNameNodes[0], node))) {
      const sameNameNode = sameNameNodes.find((t) => !Object.is(t, node));
      resetSameNameNodeListeners();
      // 同步状态
      node.instance.model(sameNameNode.instance.model());
      const listener_1 = node.instance.model.onChange((state) => {
        sameNameNode.instance.model(state);
      });
      const listener_2 = sameNameNode.instance.model.onChange((state) => {
        node.instance.model(state);
      });
      const listener_3 = sameNameNode.status.onChange((nodeStatus) => {
        if (nodeStatus === NodeStatusEnum.unmount) {
          dealWithSameNameNode(node.name);
        }
      });

      listenersRef.current.push(listener_1, listener_2, listener_3);
    }
  };

  // 这里 deps 变化需要通知 model 的监听者
  // femo@3.0.2 已支持
  const [state] = useDerivedStateWithModel(node.instance.model, (st) => {
    return {
      ...st,
      ...initState,
      [positiveUpdateFlag]: true, // 标记，会在 reducer 中删除
    };
  }, [label, name, value, visible, preserve]);

  // 这里非关键属性更新，不做通知
  useEffect(() => {
    node.instance.model.silent((state) => {
      return {
        ...state,
        ...restInitState,
      };
    });
  }, [...(Object.values(restInitState || {}))]);

  hooksHelper.propCheck(state, type);

  useDerivedState(() => {
    hooksHelper.mergeStateToInstance(node, state);
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
          return nodeHelper.getValues(node, (n) => {
            return n.deleted;
          });
        }
        return Promise.reject(errs);
      });
    };
  }, [state]);

  useEffect(() => {
    if (node.status() === NodeStatusEnum.unmount) return;
    if (node.status() === NodeStatusEnum.mount) {
      nodeDetach();
    }
    pushChild();
  }, [parentNode]);

  useEffect(() => {
    // state 控制显示/隐藏
    if (!(state?.visible)) {
      // 可能会把所有 node.instance.model 上的监听都解绑
      // 需要保持当前 useNode 里面有监听
      visibleOrUnmountNodeDetach(false);
      return;
    }
    nodePush();
  }, [state?.visible]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    setNodeValueType(node.parent, node);
    noticeSubscriber(SearchAction.node_name_change);
  }, [state?.name]);

  useEffect(() => {
    return () => {
      visibleOrUnmountNodeDetach();
    };
  }, []);

  return [state, node];
};

export default useNode;
