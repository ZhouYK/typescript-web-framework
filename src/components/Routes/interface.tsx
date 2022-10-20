import { RoadMap } from '@/config/interface';
import React, { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export interface Props {
  routes: RoadMap[];
}

export interface CurContext {
  keyPaths: RoadMap[];
  routeComponents: (React.ReactElement | React.ReactNode)[];
  componentMap: Map<string, { origin: ComponentType<any>; result: ComponentType<RouteComponentProps>, obj: RoadMap }>;
}

export interface PermittedRouteFunc {
  (roads: RoadMap[]): void;
}
