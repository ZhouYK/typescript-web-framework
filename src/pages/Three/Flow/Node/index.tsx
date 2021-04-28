import React, {
  FC, PropsWithChildren, useCallback,
} from 'react';
import classNames from 'classnames';
import { PlaySquareOutlined } from '@ant-design/icons';
import { Flow } from '../interface';
import style from './style.less';

interface Props {
  data: Flow.Node;
  refFn?: Flow.RefFn;
  isActive?: boolean;
  delItem?: (node: Flow.Node) => void;
  clickItem?: (node: Flow.Node) => void;
}

const Node: FC<Props> = (props: PropsWithChildren<Props>) => {
  const {
    data, refFn, delItem, clickItem, isActive,
  } = props;

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
  }, [refFn]);

  const onClickItem = useCallback(() => {
    clickItem(data);
  }, [clickItem, data]);

  return (
    <div onClick={onClickItem} ref={refFnCall } className={classNames(style.node, 'node-element', {
      active: isActive,
    })}>
      <div className='icon'>
        <PlaySquareOutlined />
      </div>
      <div className='symbol'>
        { data.name }
      </div>
    </div>
  );
};

export default Node;
