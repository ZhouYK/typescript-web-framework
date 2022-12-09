import {
  FieldInstance, FormInstance, FPath, NodeType, UseInstanceOptions,
} from '@/pages/Demo/Wusong/lib/interface';
import NodeContext from '@/pages/Demo/Wusong/lib/NodeProvider/NodeContext';
import nodeHelper from '@/pages/Demo/Wusong/lib/utils/nodeHelper';
import { subscribe, useDerivedState } from 'femo';
import { useContext, useEffect, useState } from 'react';

// 所有的搜索都必须在一个 context 下进行.
// 如果传了 context ，则以传入为准；
// 如果没传统一规定在一个 formNode context 查询，不论所查的 field 还是 form
const useInstance = <V = any>(path?: FPath, options?: UseInstanceOptions, type?: NodeType): [FieldInstance<V> | FormInstance<V> | null] => {
  const { context, watch = true } = options || {};
  const node = useContext(NodeContext);

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
  }, [contextNode, path]);
  const [, updateState] = useState<any>();

  useEffect(() => {
    if (target && watch) {
      return subscribe([target.instance.model], () => {
        updateState({});
      }, false);
    }
    return null;
  }, [target, watch, target.instance.model]);
  return [target?.instance];
};

export default useInstance;
