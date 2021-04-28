import React, {
  FC, PropsWithChildren, useCallback,
} from 'react';
import { useDrag } from 'react-dnd';
import classNames from 'classnames';
import { PlaySquareOutlined } from '@ant-design/icons';
import { Flow } from '../interface';
import style from './style.less';

interface Props {
  data: Flow.Node;
  isActive?: boolean;
  delItem?: (node: Flow.Node) => void;
  onClick?: (node: Flow.Node) => void;
}
export const type = 'list-node';

const Node: FC<Props> = (props: PropsWithChildren<Props>) => {
  const {
    data, delItem, onClick, isActive,
  } = props;

  const [collected, drag] = useDrag(() => ({
    type,
    item: data,
    end: (item, monitor) => {
      // console.log('end', monitor.getDropResult(), item);
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const onDel = useCallback(() => {
    if (delItem) {
      delItem(data);
    }
  }, [delItem, data]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(data);
    }
  }, [onClick, data]);
  // console.log('collected', collected);

  return (
    <div onClick={handleClick} role={type} ref={drag} className={classNames(style.node, 'node-element', {
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
