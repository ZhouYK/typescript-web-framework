import type { ComponentType, ReactElement, ReactNode } from 'react';

import type { FormItemProps as ArcoFormItemProps } from '@arco-design/web-react';
import type { FemoModel } from 'femo';
export interface CommonState<V = any> {
  value?: V;
  valueType?: NodeValueType;
  name?: string;
  label?: ReactElement | ReactNode;
  visible?: boolean; // 是否显示字段，默认为 true
  preserve?: boolean; // 是否保存字段状态，默认为 false
  disabled?: boolean;
  layout?: string;
}

export enum ValidateStatus {
  validating = 'validating',
  error = 'error',
  warn = 'warn',
  success = 'success',
  default = 'default',
}

export interface ErrorInfo<V> {
  node?: FNode;
  message?: ReactNode;
  value?: V;
  validateStatus?: ValidateStatus;
}

export type SupportedArcoFormItemProps = Pick<
  ArcoFormItemProps,
  'labelCol' | 'colon' | 'requiredSymbol' | 'required' | 'wrapperCol'
>;

export interface SerpentRule<V> {
  required?: boolean;
  message?: string | ReactNode;
  validator?: (
    value: V,
    field: FieldInstance<V>,
    form: FormInstance<any>,
  ) => ReactNode | Promise<ReactNode>;
}

export interface FieldState<V = any> extends CommonState<V> {
  errors?: ErrorInfo<V>[];
  validateStatus?: ValidateStatus;
  initialValue?: V;
  rules?: SerpentRule<V>[];
  supportedArcoFormItemProps?: SupportedArcoFormItemProps;
  [index: string]: any;
}

export interface FormState<V = any> extends Omit<CommonState<V>, 'label'> {
  errors?: ErrorInfo<V>[];
  validateStatus?: ValidateStatus;
  [index: string]: any;
}

export interface SerpentFormItemProps {
  children: ReactElement | ReactNode;
  onChange: <A = any>(arg: A) => void;
  fieldState: FieldState;
  id: string;
}

export interface SerpentContextInterface {
  presentation: ComponentType<Partial<SerpentFormItemProps>>;
  prefix: string;
}

export interface FormContextValue<V = any> {
  state: FormState<V>;
  node: FNode<FormState<V>>;
}
export interface NodeInstance<P, V = any> {
  state?: P;
  node?: FNode<P>;
  model: FemoModel<P>;
  validate: () => Promise<V>;
  query?: <T = V>(
    path: FPath,
    options?: Omit<QueryFieldInstanceOptions, 'watch'>,
  ) => null | FieldInstance<T>;
}

export type FormInstance<V = any> = NodeInstance<FormState<V>, V>;

export type FieldInstance<V = any> = NodeInstance<FieldState<V>, V>;

export interface FieldProps<V = any> extends FieldState<V> {
  presentation?: SerpentContextInterface['presentation'];
  onFieldChange?: (
    state: FieldState<V>,
    prevState: FieldState<V>,
    field: FieldInstance<V>,
  ) => void;
  field?: FNode<FieldState<V>>;
  onChange?: (value: V) => void;
  [index: string]: any;
}

export interface FormProps<V = any> extends FormState<V> {
  children: any;
  [index: string]: any;
}

export type NodeType = 'form' | 'field';
export type FPath = string;

export enum NodeStatusEnum {
  mount = 'mount',
  unmount = 'unmount',
  init = 'init',
}
export type NodeStatus =
  | NodeStatusEnum.mount
  | NodeStatusEnum.unmount
  | NodeStatusEnum.init;

export enum SearchAction {
  node_position_change = 'node_position_change',
  node_name_change = 'node_name_change',
}

export enum NodeValueType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  object = 'object',
  array = 'array',
  void = 'void',
}

export interface FNode<P = any> {
  id?: string;
  type: NodeType;
  valueType: NodeValueType;
  // 如果没有 name，则该节点及后续的子节点将会无效（不会出现在表单的任何处理之中，比如获取值，校验，查找节点等）。该节点的兄弟节点不受影响
  // 同一层级 name 应该保持唯一性，跨层级不用管
  name?: string;
  status?: FemoModel<NodeStatus>; // 节点状态: mount 在节点链表中；umount 不在节点链表中（与组件的挂载/卸载没有对应关系，有可能组件卸载了，但是节点还在链表）
  searchingPath?: Map<
    (node: FNode, str: string, action: SearchAction) => void,
    Set<string>
  >;
  instance?: NodeInstance<P>;
  parent?: FNode<P> | null;
  sibling?: FNode<P> | null;
  child?: FNode<P> | null;
  // 用于收集后代
  pushChild?: (field: FNode<P>) => void;
  // 节点自己脱落
  detach?: () => void;
  // 校验的竞态控制工具
  validateModel?: FemoModel<any>;
  scrollToField?: (fieldId: string) => void;
}

export interface NodeStateMap<V> {
  form: FormState<V>;
  field: FieldState<V>;
}

export interface NodeInstanceMap<V> {
  form: FormInstance<V>;
  field: FieldInstance<V>;
}

export interface QueryFieldInstanceOptions {
  context?: FNode;
  watch?: boolean; // 监听节点状态变化开关.默认为 true，开启; false，为关闭
  watchedKeys?: string | string[]; // 指定监听的属性名。如果不指定（不指定的情况：不传或者传入的值无效或者是空数组），在 watch 为 true 的情况下默认监听所有属性
}
