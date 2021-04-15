import React, {
  FC, PropsWithChildren, useCallback,
} from 'react';
import classNames from 'classnames';
import { Flow } from '../interface';
import style from './style.less';

interface Props {
  data: Flow.Node;
  refFn?: Flow.RefFn;
  delItem?: (node: Flow.Node) => void;
  clickItem?: (node: Flow.Node) => void;
}

const Node: FC<Props> = (props: PropsWithChildren<Props>) => {
  const {
    data, refFn, delItem,
  } = props;

  const onDel = useCallback(() => {
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
  }, [refFn]);

  return (
    <div ref={refFnCall } className={classNames(style.node, 'node-element')}>
      <div className='symbol'>
        { data.name }
      </div>
      {
        delItem ? (
          <button onClick={onDel}>删除</button>
        ) : null
      }
    </div>
  );
};

export default Node;
