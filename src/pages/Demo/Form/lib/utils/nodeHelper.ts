import {
  FieldState, FNode, FormState, FPath, NodeType, NodeValueType,
} from '@/pages/Demo/Form/lib/interface';

class NodeHelper {
  regex = {
    number: /^[0-9]+$/,
    empty: /^.+$/,
  }

  isAnonymous = (n: any) => {
    if (
      Object.is(n, null)
      || Object.is(n, undefined)
      || Object.is(n, NaN)
    ) {
      return true;
    }
    return !this.regex.empty.test(n);
  }

  isNumber = (n: string) => {
    return this.regex.number.test(`${n}`);
  }

  isForm = (type: NodeType) => {
    return type === 'form';
  }

  isField = (type: NodeType) => {
    return type === 'field';
  }

  // 链接节点
  chainChildNode = (inputNode: FNode, parentNode: FNode) => {
    // 如果传入的 inputNode 已存在于链表中，则不操作
    if (inputNode.parent || inputNode.sibling) {
      console.warn(`节点: ${inputNode.name} 已存在，请检查表单的 name 是否重复!`);
      return;
    }
    if (!parentNode.child) {
      parentNode.child = inputNode;
      inputNode.parent = parentNode;
      return;
    }
    let curNode = parentNode.child;
    // todo 每次都从头找最后一个，可能会性能问题，可以优化
    // todo 这里会成环吗？
    while (curNode) {
      if (!curNode.sibling) {
        curNode.sibling = inputNode;
        inputNode.parent = parentNode;
        return;
      }
      curNode = curNode.sibling;
    }
  }

  // 删除节点
  // 只有在节点树中的节点，才谈得上删除
  // 有个问题：节点删除了过后，其他地方通过 useField 获取到节点，并做了监听的，如何处理？
  // 23-06-28: 节点删除过后，如果节点可能再次被链接进入链表，则不解绑监听；如果不可能再次被链接，则解绑监听
  cutNode = (inputNode: FNode) => {
    // 如果 inputNode 没有父节点，就不存在兄弟节点
    // 只处理 child 指针
    if (!inputNode.parent) {
      inputNode.child = null;
      return;
    }
    // 如果 inputNode 是第一个孩子
    if (inputNode === inputNode.parent.child) {
      inputNode.parent.child = inputNode.sibling;
      inputNode.parent = null;
      inputNode.child = null;
      inputNode.sibling = null;
      return;
    }
    // 如果 inputNode 不是第一个孩子
    let cur = inputNode.parent.child;
    while (cur) {
      if (cur.sibling === inputNode) {
        cur.sibling = inputNode.sibling;
        inputNode.parent = null;
        inputNode.sibling = null;
        inputNode.child = null;
        return;
      }
      cur = cur.sibling;
    }
  }

  pathToArr = (path: FPath) => {
    let length = 0;
    let tmpPath = path;
    if (path instanceof Array) {
      length = path.length;
    } else if (typeof path === 'string' && path) {
      length = 1;
      tmpPath = [path];
    }
    return {
      length,
      tmpPath,
    };
  }

  getFirstChildNotAnonymousToDown = (n: FNode): FNode | null => {
    if (!n) return n;
    if (!this.isAnonymous(n.name)) return n;
    return this.getFirstChildNotAnonymousToDown(n.child);
  }

  getFirstChildNotAnonymousToUp = (n: FNode): FNode | null => {
    if (!n) return n;
    if (!this.isAnonymous(n.name)) return n;
    return this.getFirstChildNotAnonymousToUp(n.parent);
  }

  traverseAnonymousNode = (node: FNode, callback: (n: FNode) => boolean): boolean => {
    if (!node) return false;
    if (this.isAnonymous(node.name)) {
      return this.traverseAnonymousNode(node.child, callback);
    }
    if (callback(node)) return true;
    return this.traverseAnonymousNode(node.sibling, callback);
  }

  // 根据路径和起始节点（查找时不包含该节点）查找节点
  // 不查找 form 节点及其后代
  // form 节点作为一个封闭的区块存在（可以把 form 想象成一个进程），就像一个封闭的表单字段运行的上下文。
  // 所以在按路径查找或者取值时，都不能跨表单。
  // form 节点可以匿名，但是匿名节点的特性判断优先级小于 form 节点的特性
  findFieldNodes = (node: FNode, path: FPath): FNode[] => {
    const result: FNode[] = [];
    if (!path || !node) return result;
    const { length, tmpPath } = this.pathToArr(path);
    const cur = node.child;

    const traverse = (node: FNode, depth: number) => {
      if (!node || depth >= length) return;
      if (this.isForm(node.type)) {
        // 跳过 form 节点，寻找其兄弟节点
        traverse(node.sibling, depth);
        return;
      }

      if (this.isAnonymous(node.name)) {
        traverse(node.child, depth);
        traverse(node.sibling, depth);
        return;
      }

      const name = tmpPath[depth];
      if (name === node.name) {
        // 找到了最终的目标之一
        if (depth === length - 1) {
          result.push(node);
          // 继续在兄弟节点找
          traverse(node.sibling, depth);
          return;
        }
        // 在儿子节点找
        traverse(node.child, depth + 1);
        // 继续在兄弟节点找
        traverse(node.sibling, depth);
        return;
      }
      // 没找到，继续在兄弟找
      traverse(node.sibling, depth);
    };
    traverse(cur, 0);
    return result;
  }

  // 根据节点查找最近所属的表单父节点(如果传入的 node 就是表单节点，则返回自己)
  findNearlyParentFormNode = (node: FNode, notSelf?: boolean): FNode | undefined => {
    let cur = node;
    if (notSelf) {
      if (this.isForm(cur?.type)) {
        cur = cur.parent;
      }
    }
    while (cur) {
      if (this.isForm(cur?.type)) {
        return cur;
      }
      cur = cur.parent;
    }
    return undefined;
  }

  // 根据节点获取：节点以及其子节点的结构化数据
  // 不查找 form 节点及其子节点
  // 同 findNode 对 form 节点的解释
  // todo 添加验证
  getValues = (node: FNode<FieldState | FormState>, skip?: (n: FNode<FieldState | FormState>) => boolean) => {
    let result: { [index: string]: any };

    const getValueTemplate = (n: FNode<FieldState | FormState>) => {
      switch (n.valueType) {
        case NodeValueType.object:
          return {};
        case NodeValueType.array:
          return [];
        default:
      }
      return n.instance.model().value;
    };
    const traverse = (n: FNode<FieldState | FormState>, upperObj?: Record<string, any>) => {
      if (!n) return;
      if (this.isForm(n.type)) {
        if (upperObj || (skip && skip(n))) {
          traverse(n.sibling, upperObj);
          return;
        }

        upperObj = getValueTemplate(n);

        result = upperObj;
        traverse(n.child, upperObj);
        return;
      }

      if (skip && skip(n)) {
        traverse(n.sibling, upperObj);
        return;
      }
      // 没有值，说明没有找到合适的节点
      if (!result) {
        upperObj = {};
        result = upperObj;
      }

      // 匿名字段直接透传
      if (this.isAnonymous(n.name)) {
        traverse(n.child, upperObj);
        traverse(n.sibling, upperObj);
        return;
      }
      upperObj[n.name] = getValueTemplate(n);
      traverse(n.child, upperObj[n.name]);
      traverse(n.sibling, upperObj);
    };

    traverse(node);
    return result;
  }

  // 遍历节点
  inspect = (node: FNode<FieldState | FormState>, callback: (n: FNode<FieldState | FormState>) => boolean) => {
    const traverse = (n: FNode<FieldState | FormState>) => {
      const flag = callback(n);
      if (flag && n.child) {
        traverse(n.child);
      }

      if (flag && n.sibling) {
        traverse(n.sibling);
      }
    };
    traverse(node);
  }
}

export default new NodeHelper();
