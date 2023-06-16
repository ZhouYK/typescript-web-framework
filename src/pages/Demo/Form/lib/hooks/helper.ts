import { FieldState, FNode, FormState } from '@/pages/Demo/Form/lib/interface';

export class HooksHelper {
  mergeStateToInstance = <S>(node: FNode, state: FieldState<S> | FormState<S>) => {
    if (!node) return;
    // todo model.silent 更新的属性如果出现在 node 中，也需要同步
    node.name = state?.name;
    // 保持 instance 的引用不变很重要
    // 这里 state 中不能有名为 model 和 validate 的属性，因为这个是 instance 的保留属性名
    Object.assign(node.instance, state || {});
  }
}

export default new HooksHelper();
