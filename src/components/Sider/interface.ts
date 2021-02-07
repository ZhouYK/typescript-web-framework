import React, { ReactElement, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router';
import { RoadMap } from '@src/pages/interface';

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
  name?: string | ReactNode;
}

export interface CurContext {
  keyPaths: KeyPathItem[];
  cachedSider: RoadMap[];
  cachedElements: (React.ReactElement | null)[];
}

export interface RefInstance {
  current: any;
}

export interface RecordMenusFunc {
  (menus: RoadMap[], path?: string[], parentHasSider?: boolean): void;
}

export interface MenusFunc {
  (menus: RoadMap[], path?: string[], depth?: number): ReactElement[];
}
