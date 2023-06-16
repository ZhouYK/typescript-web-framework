import {
  FieldInstance, FNode, FormInstance, FPath, NodeStatusEnum, NodeType, UseInstanceOptions,
} from '@/pages/Demo/Form/lib/interface';
import NodeContext from '@/pages/Demo/Form/lib/NodeProvider/NodeContext';
import nodeHelper from '@/pages/Demo/Form/lib/utils/nodeHelper';
import { subscribe, useDerivedState, useLight } from 'femo';
import {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import hooksHelper from '../helper';

// 所有的搜索都必须在一个 context 下进行.
// 如果传了 context ，则以传入为准；
// 如果没传，统一规定在一个 formNode context 查询，不论所查的 field 还是 form
const useInstance = <V = any>(path?: FPath, options?: UseInstanceOptions, type?: NodeType): [FieldInstance<V> | FormInstance<V> | null] => {
  const { context, watch = true } = options || {};
  const node = useContext(NodeContext);

  const [, setState] = useState(null);
  const [refreshFlag, updateState] = useState('');
  const targetRef = useRef<FNode>(null);

  const refresh = useCallback((str: string) => {
    updateState((prevState) => {
      if (prevState === str) {
        setState({});
      }
      return str;
    });
  }, []);

  const { tmpPath } = nodeHelper.pathToArr(path || '');
  const pathString = JSON.stringify(tmpPath);

  const [formNode] = useDerivedState(() => {
    return nodeHelper.findNearlyParentFormNode(node, type === 'form');
  }, [node]);

  const contextNode = context || formNode;

  const findTarget = () => {
    let tmpTarget = null;
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
    targetRef.current = tmpTarget;
  };

  useLight(() => {
    findTarget();
  }, [refreshFlag]);

  useEffect(() => {
    findTarget();
  }, [contextNode, pathString]);

  useEffect(() => {
    const curSet = contextNode?.searchingPath?.get(refresh);
    return () => {
      curSet?.delete(pathString);
    };
  }, [pathString, contextNode]);

  useEffect(() => {
    if (targetRef.current && watch) {
      const sub_1 = subscribe([targetRef.current?.instance?.model], () => {
        setState({});
      }, false);
      const sub_2 = subscribe([targetRef.current?.status], () => {
        setState({});
      }, false);
      return () => {
        sub_1();
        sub_2();
      };
    }
    return undefined;
  }, [targetRef.current, watch, targetRef.current?.instance?.model, targetRef.current?.status]);

  useEffect(() => {
    return () => {
      const strSet = contextNode?.searchingPath?.get(refresh);
      strSet?.delete(refreshFlag);
      if (!strSet?.size) {
        contextNode?.searchingPath?.delete(refresh);
      }
    };
  }, [refreshFlag]);

  hooksHelper.mergeStateToInstance(targetRef.current, targetRef.current?.instance?.model());
  return [targetRef.current?.instance];
};

export default useInstance;
