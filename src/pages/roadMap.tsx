import React, {
  lazy,
  ReactElement,
} from 'react';
import { RoadMap } from '@src/pages/interface';
import { gluer } from 'femo';
import NotFound from '@src/components/NotFound';
import { Redirect } from 'react-router-dom';
import { getSafe } from '@src/tools/util';

export interface Key {
  [index: string]: any;
}

// 操作的是直接提取值成数组 extractPagesRoadMapAsArray
const roadMap = gluer({
  welcome: {
    name: 'Demo',
    path: '/demo',
    component: () => <Redirect to='/demo/femo' />,
    subPaths: [{
      name: 'femo',
      path: '/femo',
      component: lazy(() => import('./Demo/Femo')),
    }, {
      name: 'react hook',
      path: '/hook',
      component: lazy(() => import('./Demo/Hook')),
    }],
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
      <Redirect to={ getSafe(roads, 'welcome.path') } />
    );
  },
};

export default roadMap;
