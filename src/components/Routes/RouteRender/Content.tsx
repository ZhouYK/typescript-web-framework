import CrashPage from '@src/components/Crash';
import PrepareData from '@src/components/PrepareData';
import { RoadMap } from '@src/config/interface';
import React, { ComponentType, FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {
  road: RoadMap;
}

const RenderContent: FC<Props> = (props) => {
  const { road, ...rest } = props;
  const { prepare } = road;
  const Component = road.component as ComponentType;
  return (
    <CrashPage>
      <PrepareData {...rest} prepare={prepare}>
        <Component />
      </PrepareData>
    </CrashPage>
  );
};

export default React.memo(RenderContent);
