import {
  FieldState, FNode, FPath, NodeModel,
} from '@/pages/Demo/Wusong/lib/interface';
import WuSongNodeContext from '@/pages/Demo/Wusong/lib/NodeProvider/WuSongNodeContext';
import nodeHelper from '@/pages/Demo/Wusong/lib/utils/nodeHelper';
import { subscribe, useDerivedState } from 'femo';
import { useContext, useEffect, useState } from 'react';

interface Options {
  context?: FNode;
  watch?: boolean;
}

/**
 * 根据路径（字段name组成的数组）获取到字段state和model
 * @param path 路径（字段name组成的数组）
 * @param options context: 指定搜索的起始节点（搜索时不包含该节点），默认是最近的表单节点(FormNode)；
 * watch：是否订阅字段的变化，默认true
 */
const useQueryField = <V>(path?: FPath, options?: Options): [FieldState<V>, NodeModel<FieldState<V>>] => {
  const { context, watch = true } = options || {};
  const node = useContext(WuSongNodeContext);

  const [formNode] = useDerivedState(() => {
    return nodeHelper.findNearlyParentFormNode(node);
  }, [node]);

  const contextNode = context || formNode;

  const [target] = useDerivedState(() => {
    // 没有 path，则返回当前 fieldNode
    if (!path) return node;
    return nodeHelper.findNode(contextNode, path);
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
  return [target?.instance?.model?.(), target?.instance?.model];
};

export default useQueryField;
