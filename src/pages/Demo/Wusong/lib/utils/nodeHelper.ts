import {
  FNode, FPath,
} from '@/pages/Demo/Wusong/lib/interface';

class NodeHelper {
  // 链接节点
  chainNode = (inputNode: FNode, originNode: FNode) => {
    if (!originNode.child) {
      originNode.child = inputNode;
      inputNode.parent = originNode;
      return;
    }
    let curNode = originNode.child;
    // todo 每次都从头找最后一个，可能会性能问题，可以优化
    // todo 这里会成环吗？
    while (curNode) {
      if (!curNode.sibling) {
        curNode.sibling = inputNode;
        inputNode.parent = originNode;
        return;
      }
      curNode = curNode.sibling;
    }
  }

  // 删除节点
  cutNode = (inputNode: FNode, originNode: FNode) => {
    if (!originNode.child) {
      return;
    }
    let prevNode = originNode;
    let curNode = originNode.child;
    if (curNode === inputNode) {
      prevNode.child = curNode?.sibling ?? null;
      return;
    }
    prevNode = curNode;
    curNode = curNode?.sibling ?? null;
    while (curNode) {
      if (curNode === inputNode) {
        prevNode.sibling = curNode?.sibling ?? null;
        return;
      }
      prevNode = curNode;
      curNode = curNode?.sibling ?? null;
    }
  }

  // 根据路径和起始节点（查找时不包含该节点）查找节点
  findNode = (node: FNode, path?: FPath): FNode | undefined => {
    if (!path || !node) return undefined;
    let length = 0;
    let tmpPath = path;
    if (path instanceof Array) {
      length = path.length;
    } else if (typeof path === 'string' && path) {
      length = 1;
      tmpPath = [path];
    }
    let result: FNode | undefined;
    let cur = node.child;
    let dep = 0;
    // todo  没有cur.name的 node 需要有处理策略
    while (cur && cur.name && dep < length) {
      const name = tmpPath[dep];
      // 同一层级只会找第一个，同一层级 name 应该保持唯一性
      if (name === cur.name) {
        dep += 1;
        if (dep === length) {
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
  findNearlyParentFormNode = (node: FNode): FNode | undefined => {
    let cur = node;
    while (cur) {
      if (cur?.type === 'form') {
        return cur;
      }
      cur = cur.parent;
    }
    return undefined;
  }
}

export default new NodeHelper();
