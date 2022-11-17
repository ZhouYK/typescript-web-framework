import { FieldNode, FormNode } from '@/pages/Demo/Wusong/lib/interface';

class NodeHelper {
  chainChild = (inputNode: FieldNode | FormNode, originNode: FieldNode | FormNode) => {
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

  cutChild = (inputNode: FieldNode | FormNode, originNode: FieldNode | FormNode) => {
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
}

export default new NodeHelper();
