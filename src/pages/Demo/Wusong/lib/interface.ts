import { GluerReturn } from 'femo';

export interface FieldModelProps<V = any> {
  name: string;
  value: V;
  [index: string]: any;
}

export interface DecoratorProps {
  children?: any;
  label?: any;
  [index: string]: any;
}

export interface FormModelProps {
  [index: string]: any;
}

export interface Instance<P> {
  model: GluerReturn<P>;
  [index: string]: any;
}

export type NodeType = 'form' | 'field';

export interface Node<T, P> {
  type: NodeType;
  name: string;
  instance: Instance<P>;
  parent?: T | null;
  sibling?: T | null;
  child?: T | null;
  // 用于收集后代
  pushChild: (field: T) => void;
  // 用于删除后代
  removeChild: (field: T) => void;
}

export interface FormNode extends Node<FormNode, FormModelProps>{
}

export interface FieldNode extends Node<FieldNode, FieldModelProps>{
}
