import React, {
  FC, PropsWithChildren, useCallback,
} from 'react';
import classNames from 'classnames';
import { PlaySquareOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useDerivedModel } from 'femo';
import { getSafe } from '@src/tools/util';
import { Flow } from '../interface';
import style from './style.less';

interface Props {
  data: Flow.Node;
  refFn?: Flow.RefFn;
  isActive?: boolean;
  delItem?: (node: Flow.Node) => void;
  clickItem?: (node: Flow.Node) => void;
  devicePixelRatio: number;
}

const Node: FC<Props> = (props: PropsWithChildren<Props>) => {
  const {
    data, refFn, delItem, clickItem, isActive, devicePixelRatio,
  } = props;

  // @ts-ignore
  const onDel = useCallback((evt) => {
    evt.stopPropagation();
    evt.cancelBubble = true;
    if (delItem) {
      delItem(data);
    }
  }, [delItem, data]);

  const refFnCall = useCallback((dom: HTMLElement) => {
    if (refFn) {
      refFn({
        dom,
        data,
      });
    }
  }, [refFn, data]);

  const onClickItem = useCallback(() => {
    clickItem(data);
  }, [clickItem, data]);

  const [canDelete] = useDerivedModel(() => {
    const parents: any[] = getSafe(data, 'parents') || [];
    return !!parents.length;
  }, data, (nextSource, prevSource, state) => {
    const nextParents = getSafe(nextSource, 'parents');
    const prevParents = getSafe(prevSource, 'parents');
    if (nextParents !== prevParents) {
      return !!getSafe(nextParents, 'length');
    }
    return state;
  });

  return (
    <section ref={refFnCall} className={classNames(style.node, `scale-${devicePixelRatio}`)}>
      <div onClick={onClickItem} className={classNames('node-element', {
        active: isActive,
      })}>
        <div className='icon'>
          <PlaySquareOutlined />
        </div>
        <div className='symbol'>
          { data.name }
        </div>
      </div>
      {
        canDelete ? <section className='can-minus'><MinusCircleOutlined /></section> : null
      }
      <section className='can-plus'>
        <PlusCircleOutlined />
      </section>
    </section>
  );
};

export default Node;
