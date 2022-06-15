import CrashPage from '@src/components/Crash';
import PrepareData from '@src/components/PrepareData';
import { RoadMap } from '@src/interface';
import { useDerivedState } from 'femo';
import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { currentExactMatchedRoad } from '@src/components/Routes/roadMapDerivedModel';

interface Props extends RouteComponentProps {
  road: RoadMap;
}

const RouteRenderComponent: FC<Props> = (props) => {
  const { road, ...rest } = props;
  const { component: Component, prepare } = road;

  // 这里需要优化，时机太靠后了
  useDerivedState(() => {
    currentExactMatchedRoad(road);
  }, [road]);

  return (
    <CrashPage>
      <PrepareData { ...rest } prepare={prepare}>
        <Component />
      </PrepareData>
    </CrashPage>
  );
};
export default RouteRenderComponent;
