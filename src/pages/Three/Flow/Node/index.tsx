import React, {
  FC, PropsWithChildren, useCallback,
} from 'react';
import classNames from 'classnames';
import { Flow } from '../interface';
import style from './style.less';

interface Props {
  number: number;
  symbol: any;
  details: any;
  data: Flow.Node;
  refFn: Flow.RefFn;
}

const Node: FC<Props> = (props: PropsWithChildren<Props>) => {
  const {
    number, symbol, details, data, refFn,
  } = props;

  const refFnCall = useCallback((dom: HTMLElement) => {
    refFn({
      dom,
      data,
    });
  }, [refFn]);
  return (
    <div ref={refFnCall} className={classNames(style.node, 'node-element')} style={{ backgroundColor: `rgba(0, 127, 127, ${Math.random() * 0.5 + 0.25})` }}>
      <div className='number'>
        { number }
      </div>
      <div className='symbol'>
        { symbol }
      </div>
      <div className='details'>
        { details }
      </div>
    </div>
  );
};

export default Node;
