import React, {
  ReactElement,
} from 'react';
import { RoadMap } from '@src/pages/interface';
import { gluer } from 'femo';
import NotFound from '@src/components/NotFound';
import { Redirect } from 'react-router-dom';
import { getSafe } from '@src/tools/util';
import Demo from '@src/pages/Demo';

export interface Key {
  [index: string]: any;
}

// 这里的 key 不重要，切记
// 操作的是直接提取值成数组 extractPagesRoadMapAsArray
const roadMap = gluer({
  welcome: {
    name: '',
    path: '/',
    visible: false,
    component: Demo,
  },
});

// 作为兜底的路由配置
// 将所有路由重定向到
export const road404: RoadMap = {
  name: '404',
  path: '*',
  component: (): ReactElement => <NotFound />,
  permissions: [], // 无权限要求
};

/*
 * 根路径的路由，比较特殊。类别和404路由一样，不放到pagesRoadmap中
 * */

export const roadRoot: RoadMap = {
  path: '/',
  name: 'root',
  component: (): any => {
    const roads = roadMap();
    return (
      <Redirect to={ getSafe(roads, 'hr.path') } />
    );
  },
};

export default roadMap;
