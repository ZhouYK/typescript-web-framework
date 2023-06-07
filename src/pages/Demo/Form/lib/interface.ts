import { GluerReturn } from 'femo';

export type NodeModel<V = any> = GluerReturn<V>

export interface FieldState<V = any> {
  label?: any;
  name?: string;
  value?: V;
  required?: boolean;
  errors?: any[];
  validateStatus?: ValidateStatus;
  validator?: (value: V, field: FieldInstance<V>, form: FormInstance<any>) => string;
}

export interface FormState<V = any> {
  errors?: any[];
  name?: string;
  value?: V;
}

export interface NodeInstance<P, V = any> {
  model: NodeModel<P>;
  validate: () => Promise<V>;
  value?: V;
}

export interface FormInstance<V = any> extends NodeInstance<FormState<V>, V>, FormState<V> {
}

export interface FieldInstance<V = any> extends NodeInstance<FieldState<V>, V>, FieldState<V> {
}

type ValidateStatus = 'validating' | 'error' | 'warning' | 'success';

export interface FieldProps<V = any> extends FieldState<V> {
  children: any;
  [index: string]: any;
}

export interface FormProps<V = any> extends FormState<V>{
  children: any;
  [index: string]: any;
}

export type NodeType = 'form' | 'field';
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
}

export interface UseInstanceOptions {
  context?: FNode;
  watch?: boolean;
}
