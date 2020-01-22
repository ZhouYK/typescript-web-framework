import { RouteComponentProps } from 'react-router';
import React, {ReactElement} from 'react';
import { SubSider } from '../Routes/interface';

export { Key } from '../../pages/model/pagesRoadMap';
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

export interface RenderFunc {
  (sider: SubSider, path?: string[], depth?: number): ReactElement[];
}
