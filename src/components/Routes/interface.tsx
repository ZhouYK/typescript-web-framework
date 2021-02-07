import { RouteComponentProps } from 'react-router';
import { RoadMap } from '@src/pages/interface';
import React from 'react';

export interface Props {
  routes: RoadMap[];
}

export interface SubSider {
  subSider: RoadMap[];
  basePath: string;
}

export interface KeyPathItem {
  path?: string;
  component?: any;
  subSider?: SubSider;
  hasSubSider?: boolean;
  hasSider?: boolean;
  visible?: boolean;
  access?: boolean;
  fallback?: (props: RouteComponentProps) => any;
  authResult?: { [index: string]: boolean };
}

export interface CurContext {
  keyPaths: KeyPathItem[];
  cachedRoutes: RoadMap[];
  routeComponents: React.ReactElement[];
}

export interface PermittedRouteFunc {
  (roads: RoadMap[], path?: string[], subSider?: SubSider, parentHasSubSider?: boolean, parentHasSider?: boolean, parentFallback?: (props: RouteComponentProps) => any): void;
}
