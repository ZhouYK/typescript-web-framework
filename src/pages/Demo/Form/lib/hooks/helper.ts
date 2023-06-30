import {
  FieldState, FNode, FormState, NodeType,
} from '@/pages/Demo/Form/lib/interface';

export class HooksHelper {
  mergeStateToInstance = <S>(node: FNode, state: FieldState<S> | FormState<S>) => {
    if (!node) return;
    // todo model.silent 更新的属性如果出现在 node 中，也需要同步
    node.name = state?.name;
    // 保持 instance 的引用不变很重要
    // 这里 state 中不能有名为 model 和 validate 的属性，因为这个是 instance 的保留属性名
    Object.assign(node.instance, state || {});
  }

  propCheck = <V>(state: Partial<FieldState<V> | FormState<V>>, type: NodeType) => {
    if ('name' in state && (typeof state.name !== 'string' && typeof state.name !== 'undefined')) {
      const strFn = (main: string) => `${main} name should be string`;
      let str = '';
      if (type === 'field') {
        str = strFn('Field');
      } else if (type === 'form') {
        str = strFn('Form');
      }
      throw new Error(str);
    }
  }
}

export default new HooksHelper();
