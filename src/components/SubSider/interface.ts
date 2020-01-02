import { RouteComponentProps } from 'react-router';
import React from 'react';
import { SubSider } from '../Routes/interface';
import { QueryRoad } from '../../pages/pagesRoadMap';

export { QueryRoad, Key } from '../../pages/pagesRoadMap';
export { SubSider } from '../Routes/interface';
export { EXTERN_KEY_PREFIX } from '../Sider/interface';
export interface State {
  openKeys: string[];
  selectedKeys: string[];
}
export interface SubSiderProps extends RouteComponentProps {
  sider: SubSider;
  children?: any;
  hasSider?: boolean;
}

export interface KeyPathItem {
  keyPath: string;
  depth: number;
  component?: React.Component;
  queries?: QueryRoad[];
}

export interface CurContext {
  keyPaths: KeyPathItem[];
  cachedSider: SubSider;
  cachedElements: (React.ReactElement | null)[];
}

export interface RefInstance {
  current: any;
}

export const OTHER_NAV_KEY_PREFIX = 'other_nav_key_';
