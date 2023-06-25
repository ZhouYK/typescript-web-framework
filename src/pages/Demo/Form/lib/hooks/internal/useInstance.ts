import {
  FieldInstance, FNode, FormInstance, FPath, NodeType, SearchAction, UseInstanceOptions,
} from '@/pages/Demo/Form/lib/interface';
import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import nodeHelper from '@/pages/Demo/Form/lib/utils/nodeHelper';
import { FemoModel, subscribe, useDerivedState } from 'femo';
import {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import hooksHelper from '../helper';

// 所有的搜索都必须在一个 context 下进行.
// 如果传了 context ，则以传入为准；
// 如果没传，统一规定在一个 formNode context 查询，不论所查的 field 还是 form
const useInstance = <V = any>(path?: FPath, options?: UseInstanceOptions, type?: NodeType): [FieldInstance<V> | FormInstance<V> | null] => {
  const { context, watch = true } = options || {};
  const targetModelRef = useRef<FemoModel<FNode>>(null);

  const nodes = useContext(NodeContext);
  const [node] = useDerivedState(() => {
    return nodes?.[0];
  }, [nodes]);

  const [reFindNode, setReFindNode] = useState(null);
  const [, setState] = useState(null);

  const [pathString] = useDerivedState(() => {
    return JSON.stringify(nodeHelper.pathToArr(path || '')?.tmpPath || '');
  }, [path]);

  const [formNode] = useDerivedState(() => {
    return nodes.find((n) => {
      return n.type === 'form';
    });
  }, [nodes]);

  const contextNode = context || formNode;

  const refresh = useCallback((node: FNode, _str: string, action: SearchAction) => {
    switch (action) {
      case SearchAction.node_position_change: {
        targetModelRef.current?.(node);
      }
        break;
      case SearchAction.node_name_change: {
        setReFindNode({});
      }
        break;
      default:
    }
  }, []);

  const [target, targetModel] = useDerivedState((preState) => {
    let tmpTarget = preState;
    // 没有 path，则返回当前所属的 node
    if (!path) {
      tmpTarget = nodeHelper.isForm(node.type) ? null : node;
    } else if (!path || !path.length) {
      if (type === node.type) {
        tmpTarget = node;
      }
    } else {
      tmpTarget = nodeHelper.findNode(contextNode, path, type);
    }
    // 没有找到目标节点才会去记录
    if (!tmpTarget) {
      if (!(contextNode?.searchingPath)) {
        contextNode.searchingPath = new Map();
      }
      let strSet = contextNode.searchingPath.get(refresh);
      if (!strSet) {
        strSet = new Set();
        contextNode.searchingPath.set(refresh, strSet);
      }
      strSet.add(pathString);
    }
    return tmpTarget;
  }, [contextNode, pathString, reFindNode]);
  targetModelRef.current = targetModel;

  useEffect(() => {
    const curSet = contextNode?.searchingPath?.get(refresh);
    return () => {
      curSet?.delete(pathString);
    };
  }, [contextNode, pathString]);

  useEffect(() => {
    if (target && watch) {
      const sub_1 = subscribe([target?.instance?.model], () => {
        setState({});
      }, false);
      const sub_2 = subscribe([target?.status], () => {
        setState({});
      }, false);
      return () => {
        sub_1();
        sub_2();
      };
    }
    return undefined;
  }, [target, watch]);

  hooksHelper.mergeStateToInstance(target, target?.instance?.model());
  return [target?.instance];
};

export default useInstance;
