import {
  FieldState,
  FNode, FormState, FPath, NodeType,
} from '@/pages/Demo/Form/lib/interface';

class NodeHelper {
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
  // todo 有个问题：节点删除了过后，其他地方通过 useField 获取到节点，并做了监听的，如何处理？
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

  // 根据路径和起始节点（查找时不包含该节点）查找节点
  findNode = (node: FNode, path: FPath, type?: NodeType): FNode | undefined => {
    if (!path || !node) return undefined;
    const { length, tmpPath } = this.pathToArr(path);

    let result: FNode | undefined;
    let cur = node.child;
    let dep = 0;
    // todo  没有cur.name的 node 需要有处理策略
    while (cur && cur.name && dep < length) {
      const name = tmpPath[dep];
      // 同一层级只会找第一个，同一层级 name 应该保持唯一性
      if (name === cur.name) {
        dep += 1;
        if (dep === length && ((!type) || cur.type === type)) {
          result = cur;
        }
        cur = cur.child;
      } else if (cur.sibling) {
        cur = cur.sibling;
      } else {
        cur = null;
      }
    }
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
  // todo 添加验证
  getValues = (node: FNode<FieldState | FormState>) => {
    const result: { [index: string]: any } = {};
    let tmp = result;
    let cur = node;

    if (!cur.child) {
      if (this.isForm(cur.type)) {
        return result;
      }
      tmp[cur.name] = cur.instance.model().value;
      return result;
    }

    if (!this.isForm(cur.type)) {
      tmp[cur.name] = {};
      tmp = tmp[cur.name];
    }
    cur = cur.child;
    while (cur) {
      if (this.isForm(cur.type)) {
        cur = cur.sibling;
        continue;
      }
      if (cur.child) {
        tmp[cur.name] = {};
        tmp = tmp[cur.name];
        cur = cur.child;
        continue;
      }
      tmp[cur.name] = cur.instance.model().value;
      if (cur.sibling) {
        cur = cur.sibling;
        continue;
      }
      cur = null;
    }
    return result;
  }

  // 遍历节点
  inspect = (node: FNode<FieldState | FormState>, callback: (n: FNode<FieldState | FormState>) => boolean) => {
    let cur = node;
    let flag = true;
    while (flag && cur) {
      flag = callback(cur);
      if (cur.child) {
        cur = cur.child;
        continue;
      }
      if (cur.sibling) {
        cur = cur.sibling;
        continue;
      }
      cur = null;
    }
  }

  // 回溯节点，直到找到目标上下文节点
  backtrackForContextNode = (curNode: FNode<FieldState | FormState>) => {
    let parent = curNode?.parent;
    const path = [curNode.name];
    while (parent) {
      const tmpPath = JSON.stringify(path);
      // eslint-disable-next-line no-loop-func
      parent?.searchingPath?.forEach((value, key) => {
        if (value.has(tmpPath)) {
          key?.(tmpPath);
        }
      });
      path.unshift(parent.name);
      parent = parent.parent;
    }
  }
}

export default new NodeHelper();
