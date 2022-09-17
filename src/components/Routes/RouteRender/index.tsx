import RenderContent from '@src/components/Routes/RouteRender/Content';
import { RoadMap } from '@src/config/interface';
import React, { FC, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import currentRoadModel from '../currentRoad/model';

interface Props extends RouteComponentProps {
  road: RoadMap;
}

const RouterRender: FC<Props> = (props) => {
  const { road } = props;
  useEffect(() => {
    currentRoadModel(road);
  }, [road]);
  return <RenderContent {...props} />;
};
export default RouterRender;
