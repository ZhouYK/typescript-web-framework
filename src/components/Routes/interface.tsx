import { RoadMap } from '@/config/interface';
import React from 'react';

export interface Props {
  routes: RoadMap[];
}

export interface CurContext {
  keyPaths: RoadMap[];
  routeComponents: (React.ReactElement | React.ReactNode)[];
}

export interface PermittedRouteFunc {
  (roads: RoadMap[]): void;
}
