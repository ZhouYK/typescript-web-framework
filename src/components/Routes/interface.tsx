import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
import { QueryRoad, RoadMap } from '../../pages/pagesRoadMap';

export interface Props {
  routes: RoadMap[];
  dispatch: Dispatch<any>;
}

export interface DvaProps {
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
  queries?: QueryRoad[];
  authResult?: { [index: string]: boolean };
}

export interface CurContext {
  keyPaths: KeyPathItem[];
  cachedRoutes: RoadMap[];
  routeComponents: React.ReactElement[];
}
