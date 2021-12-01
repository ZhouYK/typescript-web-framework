import React, {
  FC,
  useEffect, useRef, useState,
} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  gluer,
  GluerReturn, ServiceControl,
} from 'femo';
import { RoadMap } from '@src/interface';

interface Props extends RouteComponentProps {
  prepare?: RoadMap['prepare'];
}

export interface PrepareDataInjectProps<D = any> {
  control: GluerReturn<ServiceControl<D>>;
}

const PrepareData: FC<Props> = (props) => {
  const { prepare, ...rest } = props;
  const umountRef = useRef(false);

  const [control] = useState(() => gluer<ServiceControl>({
    loading: false,
    successful: false,
  }));

  // 只在组件第一次渲染的时候调用prepare准备数据
  useState(() => {
    if (prepare) {
      // 使用silent，是为了减少当前组件刷新次数
      // control是在useModel、useIndividualModel中使用onChange监听的，所以能执行silent不会跳过onChange回调
      control((_d, s) => ({
        ...s,
        loading: true,
        successful: false,
      }));
      prepare(rest).then((d) => {
        if (umountRef.current) return;
        control((_d, s) => ({
          ...s,
          loading: false,
          successful: true,
          data: d,
        }));
      }).catch(() => {
        if (umountRef.current) return;
        control((_d, s) => ({
          ...s,
          loading: false,
          successful: false,
        }));
      });
    }
  });

  useEffect(() => () => {
    umountRef.current = true;
  }, []);

  if (React.isValidElement(props.children)) {
    // cloneElement针对 props的赋值是一个merge操作
    return React.cloneElement(props.children, {
      ...rest,
      control,
    });
  }
  return (
    <>
      {props.children}
    </>
  );
};

export default PrepareData;