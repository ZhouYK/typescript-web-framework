import React from 'react';
import { RouteComponentProps } from 'react-router';
import { RoadMap } from '../../pages/model/pagesRoadMap';

export const EXTERN_KEY_PREFIX = 'EXTERN_KEY_PREFIX';

export interface Props extends RouteComponentProps {
  sider: RoadMap[];
}

export interface State {
  openKeys: string[];
  selectedKeys: string[];
}

export interface KeyPathItem {
  keyPath: string;
  component?: React.Component;
  depth?: number;
}

export interface CurContext {
  keyPaths: KeyPathItem[];
  cachedSider: RoadMap[];
  cachedElements: (React.ReactElement | null)[];
}

export interface RefInstance {
  current: any;
}
