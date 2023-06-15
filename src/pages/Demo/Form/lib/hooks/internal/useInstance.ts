import {
  FieldInstance, FormInstance, FPath, NodeType, UseInstanceOptions,
} from '@/pages/Demo/Form/lib/interface';
import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import nodeHelper from '@/pages/Demo/Form/lib/utils/nodeHelper';
import { subscribe, useDerivedState } from 'femo';
import {
  useCallback, useContext, useEffect, useState,
} from 'react';

// 所有的搜索都必须在一个 context 下进行.
// 如果传了 context ，则以传入为准；
// 如果没传，统一规定在一个 formNode context 查询，不论所查的 field 还是 form
const useInstance = <V = any>(path?: FPath, options?: UseInstanceOptions, type?: NodeType): [FieldInstance<V> | FormInstance<V> | null] => {
  const { context, watch = true } = options || {};
  const node = useContext(NodeContext);
  const [, updateState] = useState(null);

  const refresh = useCallback(() => {
    console.log('执行');
    updateState({});
  }, []);

  const { tmpPath } = nodeHelper.pathToArr(path || '');
  const pathString = JSON.stringify(tmpPath);

  const [formNode] = useDerivedState(() => {
    return nodeHelper.findNearlyParentFormNode(node, type === 'form');
  }, [node]);

  const contextNode = context || formNode;

  const [target] = useDerivedState(() => {
    // 没有 path，则返回当前所属的 node
    if (!path) return nodeHelper.isForm(node.type) ? null : node;
    if (!path || !path.length) {
      if (type === node.type) return node;
      return null;
    }
    return nodeHelper.findNode(contextNode, path, type);
  }, [contextNode, pathString]);

  // 没有找到目标节点才会去记录
  if (!target) {
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

  useEffect(() => {
    const curSet = contextNode?.searchingPath?.get(refresh);
    return () => {
      curSet?.delete(pathString);
    };
  }, [pathString, contextNode]);

  useEffect(() => {
    if (target && watch) {
      const sub_1 = subscribe([target?.instance?.model], () => {
        updateState({});
      }, false);
      const sub_2 = subscribe([target?.status], () => {
        updateState({});
      }, false);
      return () => {
        sub_1();
        sub_2();
      };
    }
    return null;
  }, [target, watch, target?.instance?.model, target?.status]);

  useEffect(() => {
    return () => {
      contextNode?.searchingPath?.delete(refresh);
    };
  }, []);
  return [target?.instance];
};

export default useInstance;
