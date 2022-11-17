import { GluerReturn } from 'femo';

export interface FieldModelProps<V = any> {
  name: string;
  value: V;
  [index: string]: any;
}
export type FieldModel<V = any> = GluerReturn<FieldModelProps<V>>

export interface DecoratorProps {
  children?: any;
  label?: any;
  [index: string]: any;
}

export interface FormModelProps {
  [index: string]: any;
}

export interface Instance<P> {
  model: FieldModel<P>;
  [index: string]: any;
}

export type NodeType = 'form' | 'field';
export type FPath = string | string[];

export interface FNode<T extends FNode = any, P = any> {
  type: NodeType;
  // 如果没有 name，则该节点及后续的子节点将会无效（不会出现在表单的任何处理之中，比如获取值，校验，查找节点等）。该节点的兄弟节点不受影响
  // 同一层级 name 应该保持唯一性，跨层级不用管
  name: string;
  instance: Instance<P>;
  parent?: FNode<T, P> | null;
  sibling?: FNode<T, P> | null;
  child?: FNode<T, P> | null;
  // 用于收集后代
  pushChild: (field: FNode<T, P>) => void;
  // 用于删除后代
  removeChild: (field: FNode<T, P>) => void;
}

export interface FormNode extends FNode<FormNode, FormModelProps>{
}

export interface FieldNode extends FNode<FieldNode, FieldModelProps>{
}
