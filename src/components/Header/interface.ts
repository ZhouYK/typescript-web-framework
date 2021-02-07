import { ReactNode } from 'react';
import { RoadMap } from '@src/pages/interface';
import { RouteComponentProps } from 'react-router';


export interface Props extends RouteComponentProps {
  breadcrumbNameMap: { [index: string]: any };
}

export interface WholeProps extends RouteComponentProps {
  userRoadMap: RoadMap[];
}

export interface SimpleRoute {
  externUrl?: string;
  realPath?: string;
  path: string;
  hasHeader: boolean;
  name: string | ReactNode;
}

export interface CurContext {
  cachedRoadMap: RoadMap[];
  recordRoads: SimpleRoute[];
}
