import React from 'react';
import { RoadMap } from '@src/config/interface';

export const EXTERN_KEY_PREFIX = 'EXTERN_KEY_PREFIX';

export interface Props {
  sider: RoadMap[];
  currentRoad: RoadMap;
}

export interface State {
  openKeys: string[];
  selectedKeys: string[];
}

export interface CurContext {
  cachedElements: (React.ReactElement | null)[];
}

export interface RefInstance {
  current: any;
}
