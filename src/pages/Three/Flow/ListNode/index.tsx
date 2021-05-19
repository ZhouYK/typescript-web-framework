import React, {
  FC, PropsWithChildren, useCallback,
} from 'react';
import { useDrag } from 'react-dnd';
import classNames from 'classnames';
import { DeleteOutlined, PlaySquareOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Flow } from '../interface';
import style from './style.less';

interface Props {
  data: Flow.ResourceNode;
  isActive?: boolean;
  delItem?: (node: Flow.ResourceNode) => void;
  onClick?: (node: Flow.ResourceNode) => void;
}
export const type = 'list-node';

const Node: FC<Props> = (props: PropsWithChildren<Props>) => {
  const {
    data, delItem, onClick, isActive,
  } = props;

  const [/* collected */, drag] = useDrag(() => ({
    type,
    item: data,
    // end: (item, monitor) => {
    //    console.log('end', monitor.getDropResult(), item);
    // },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const onDel = useCallback((evt: React.MouseEvent) => {
    evt.stopPropagation();
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
      <Tooltip
        title='删除'
      >
        <section className='delete' onClick={onDel}>
          <DeleteOutlined />
        </section>
      </Tooltip>
    </div>
  );
};

export default Node;
