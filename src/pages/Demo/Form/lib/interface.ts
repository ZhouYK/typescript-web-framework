import { FemoModel, GluerReturn } from 'femo';

export type NodeModel<V = any> = GluerReturn<V>

export interface FieldState<V = any> {
  label?: any;
  name: string;
  value?: V;
  visible?: boolean; // 是否显示字段，默认为 true
  preserve?: boolean; // 是否保存字段状态，默认为 false
  required?: boolean;
  errors?: any[];
  validateStatus?: ValidateStatus;
  validator?: (value: V, field: FieldInstance<V>, form: FormInstance<any>) => string;
}

export interface FormState<V = any> {
  errors?: any[];
  name: string;
  visible?: boolean; // 是否显示表单，默认为 true
  preserve?: boolean; // 是否保存表单状态，默认为false
  value?: V;
}

export type NodeInstance<P, V = any> = {
  model: NodeModel<P>;
  validate: () => Promise<V>;
  value?: V;
  name: string;
} & {
  [k in keyof P]: P[k];
}

export interface FormInstance<V = any> extends NodeInstance<FormState<V>, V>, FormState<V> {
}

export interface FieldInstance<V = any> extends NodeInstance<FieldState<V>, V>, FieldState<V> {
}

type ValidateStatus = 'validating' | 'error' | 'warning' | 'success' | 'default';

export interface FieldProps<V = any> extends FieldState<V> {
  children: any;
  onFieldChange?: (value: V, field: FieldInstance<V>) => void;
  [index: string]: any;
}

export interface FormProps<V = any> extends FormState<V>{
  children: any;
  [index: string]: any;
}

export type NodeType = 'form' | 'field';
export type FPath = string | string[];
export enum NodeStatusEnum {
  mount = 'mount',
  unmount = 'unmount'
}
export type NodeStatus = NodeStatusEnum.mount | NodeStatusEnum.unmount;
export interface FNode<P = any> {
  type: NodeType;
  // 如果没有 name，则该节点及后续的子节点将会无效（不会出现在表单的任何处理之中，比如获取值，校验，查找节点等）。该节点的兄弟节点不受影响
  // 同一层级 name 应该保持唯一性，跨层级不用管
  name: string;
  status: FemoModel<NodeStatus>; // 节点状态: mount 在节点链表中；umount 不在节点链表中（与组件的挂载/卸载没有对应关系，有可能组件卸载了，但是节点还在链表）
  deleted: boolean; // 标记删除（软删），可恢复
  searchingPath?: Map<() => void, Set<string>>;
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
