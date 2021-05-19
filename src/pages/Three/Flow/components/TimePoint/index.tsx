import React, {
  FC, PropsWithChildren, useCallback, useRef,
} from 'react';
import { Flow } from '@src/pages/Three/Flow/interface';
import { useDerivedStateToModel, useIndividualModel } from 'femo';
import { Button, Popover, Space } from 'antd';
import JSVideo from '@src/pages/Three/Flow/Video';
import useVisible from '@src/hooks/useVisible';
import { isEmpty } from '@src/tools/util';
import flv from 'flv.js';
import style from './style.less';

interface Props {
  node: Flow.Node;
  value?: number; // 非负整数
  onChange?: (value: number) => void;
}

// value 为秒
const formatTime = (value: number) => {
  if (isEmpty(value)) return '';
  const intValue = Math.floor(value);
  const hour = Math.floor(intValue / 3600);
  const minute = Math.floor((intValue - hour * 3600) / 60);
  const second = intValue - hour * 3600 - minute * 60;
  let hourStr = `${hour}`;
  if (hour < 10) {
    hourStr = `0${hourStr}`;
  }
  let minuteStr = `${minute}`;
  if (minute < 10) {
    minuteStr = `0${minuteStr}`;
  }

  let secondStr = `${second}`;
  if (second < 10) {
    secondStr = `0${secondStr}`;
  }
  return `${hourStr}:${minuteStr}:${secondStr}`;
};

const TimePoint: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { node, value, onChange } = props;

  const player = useRef<React.MutableRefObject<flv.Player>>();
  const result = useVisible(false);
  const [, valueModel] = useIndividualModel(value);
  const [derivedValue] = useDerivedStateToModel(props, valueModel, (nextProps, _prevProps, state) => {
    if ('value' in nextProps) {
      return nextProps.value;
    }
    return state;
  });

  const hide = useCallback(() => {
    if (player.current && player.current.current) {
      player.current.current.pause();
    }
    result.hide();
  }, [result.hide]);

  const show = useCallback(() => {
    result.show();
  }, [result.show]);

  const valueChange = useCallback((v: number) => {
    const value = isEmpty(v) ? v : Math.floor(v);
    if (onChange) {
      onChange(value);
    } else {
      valueModel(value);
    }
  }, [onChange, valueModel]);

  const confirm = useCallback(() => {
    valueChange(player?.current?.current?.currentTime);
    hide();
  }, [valueChange, hide]);

  const cancel = useCallback(() => {
    hide();
  }, [hide]);

  const onVisibleChange = useCallback((v) => {
    if (v) {
      show();
    } else {
      hide();
    }
  }, [show, hide]);

  const getPlayer = useCallback((p) => {
    player.current = p;
  }, []);

  const content = (
    <section className={style.content}>
      <section className='video-close-wrap'>
        <JSVideo getPlayer={getPlayer} type='mp4' video={node} currentTime={derivedValue}/>
      </section>
      <section className='btn-row'>
        <Space>
          <Button size='small' onClick={cancel}>取消</Button>
          <Button type='primary' size='small' onClick={confirm}>确定</Button>
        </Space>
      </section>
    </section>
  );

  return (
    <section>
      <Popover
        content={content}
        visible={result.visible}
        onVisibleChange={onVisibleChange}
        trigger='click'
        placement='topRight'
      >
        <section className={style.value}>{isEmpty(derivedValue) ? <span className='placeholder'>请选择</span> : formatTime(derivedValue) }</section>
      </Popover>
    </section>
  );
};

export default TimePoint;
