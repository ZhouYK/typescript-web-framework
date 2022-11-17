import {
  FieldModel, FieldModelProps, FNode, FPath,
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
const useField = (path?: FPath, options?: Options): [FieldModelProps, FieldModel] => {
  const { context, watch = true } = options || {};
  const node = useContext(WuSongNodeContext);

  const [formNode] = useDerivedState(() => {
    return nodeHelper.findNearlyParentFormNode(node);
  }, [node]);

  const contextNode = context || formNode;

  const [target] = useDerivedState(() => {
    // path 和 context 没有，则返回 fieldNode
    if (!path && !context && node) return node;
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
  }, [target, watch]);
  return [target?.instance?.model?.(), target?.instance?.model];
};

export default useField;
