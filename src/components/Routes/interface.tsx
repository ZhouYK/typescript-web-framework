import { RoadMap } from '@src/interface';
import React from 'react';

export interface Props {
  routes: RoadMap[];
}

export interface CurContext {
  keyPaths: RoadMap[];
  routeComponents: React.ReactElement[];
}

export interface PermittedRouteFunc {
  (roads: RoadMap[]): void;
}
