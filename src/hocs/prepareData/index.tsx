import currentRoadModel from '@/components/Routes/currentRoad/model';
import React, {
  ComponentType, FC,
  useEffect, useRef, useState,
} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  gluer,
  GluerReturn, ServiceControl,
} from 'femo';

interface Props extends RouteComponentProps {
}

export interface PrepareDataInjectProps<D = any> {
  control?: GluerReturn<ServiceControl<D>>;
}

const prepareData = (component: ComponentType<any>): ComponentType<Props> => {
  const FinalComponent: FC<Props> = (props) => {
    const { ...rest } = props;
    const Component = component;
    const umountRef = useRef(false);
    const firstRef = useRef(false);
    // currentRoadModel 会在 Route 里面更新，也只会在 route 更新
    const { prepare } = currentRoadModel();

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

    return (
      <Component {...rest} control={control} />
    );
  };
  FinalComponent.displayName = component.displayName;
  return FinalComponent;
};

export default prepareData;
