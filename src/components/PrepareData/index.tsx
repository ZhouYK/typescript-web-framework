import React, {
  FC, ReactNode,
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
  children?: ReactNode;
}

export interface PrepareDataInjectProps<D = any> {
  control?: GluerReturn<ServiceControl<D>>;
}

const PrepareData: FC<Props> = (props) => {
  const { prepare, ...rest } = props;
  const umountRef = useRef(false);
  const firstRef = useRef(false);

  const [control] = useState(() => gluer<ServiceControl>({
    loading: false,
    successful: false,
  }));

  // 只在组件第一次渲染的时候调用prepare准备数据
  if (!firstRef.current) {
    firstRef.current = true;
    if (prepare) {
      // control是在useModel、useIndividualModel中使用onChange监听的
      control((_d, s) => ({
        ...s,
        loading: true,
        successful: false,
      }));
      prepare(rest, control).then((d) => {
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
  }

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
