import React, {
  FC, PropsWithChildren, useCallback,
} from 'react';
import { useDrag } from 'react-dnd';
import classNames from 'classnames';
import { Flow } from '../interface';
import style from './style.less';

interface Props {
  data: Flow.Node;
  delItem?: (node: Flow.Node) => void;
}
export const type = 'list-node';

const Node: FC<Props> = (props: PropsWithChildren<Props>) => {
  const {
    data, delItem,
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
  // console.log('collected', collected);

  return (
    <div role={type} ref={drag} className={classNames(style.node, 'node-element')} style={{ backgroundColor: 'rgba(0, 127, 127, 0.5)' }}>
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
