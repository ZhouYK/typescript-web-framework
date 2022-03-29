import { RoadMap } from '@src/interface';
import React, { ComponentType } from 'react';

export interface Props {
  routes: RoadMap[];
}

export interface CurContext {
  keyPaths: RoadMap[];
  routeComponents: React.ReactElement[];
}

export interface PermittedRouteFunc {
  (roads: RoadMap[], path?: string[], parentHasSubSider?: boolean, parentHasSider?: boolean, parentFallback?: ComponentType): void;
}
