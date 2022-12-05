import { GluerReturn } from 'femo';

export type NodeModel<V = any> = GluerReturn<V>

export interface NodeInstance<P, V = any> {
  model: NodeModel<P>;
  validate: () => Promise<V>;
  value?: V;
  [index: string]: any;
}

export interface FormInstance<V = any> extends NodeInstance<FormState<V>, V> {
}

export interface FieldInstance<V = any> extends NodeInstance<FieldState<V>, V> {
}

export interface DecoratorProps {
  children?: any;
  label?: any;
  [index: string]: any;
}

export interface FieldState<V = any> {
  name?: string;
  value?: V;
  label?: any;
  [index: string]: any;
}

export interface FormProps<V = any> {
  name?: string;
  form?: FormInstance<V>;
  value?: V;
  children: any;
}

export interface FormState<V = any> {
  name?: string;
  value?: V;
  [index: string]: any;
}

export type NodeType = 'form' | 'field' | 'array-field';
export type FPath = string | string[];

export interface FNode<P = any> {
  type: NodeType;
  // 如果没有 name，则该节点及后续的子节点将会无效（不会出现在表单的任何处理之中，比如获取值，校验，查找节点等）。该节点的兄弟节点不受影响
  // 同一层级 name 应该保持唯一性，跨层级不用管
  name: string;
  instance: NodeInstance<P>;
  parent?: FNode<P> | null;
  sibling?: FNode<P> | null;
  child?: FNode<P> | null;
  // 用于收集后代
  pushChild: (field: FNode<P>) => void;
  // 节点自己脱落
  detach: () => void;
}

export interface NodeStateMap<V> {
  form: FormState<V>;
  field: FieldState<V>;
  'array-field': FieldState<V>;
}
