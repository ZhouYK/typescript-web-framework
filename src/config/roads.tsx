import NotFound from '@/components/NotFound';
import prepareData from '@/hocs/prepareData';
import { RoadMap, RoadMapModuleType, RoadMapType } from '@/config/interface';
import { Femo } from '@/pages/Demo/Femo/interface';
import femoService from '@/pages/Demo/Femo/service';
import { queryToObject } from '@/tools/util';
import { gluer, GluerReturn } from 'femo';
import { lazy, ReactElement } from 'react';
import { Redirect } from 'react-router-dom';

/*
 * 根路径的路由
 * */
// eslint-disable-next-line
let roads: GluerReturn<RoadMapModuleType>;
export const roadRoot: RoadMap = {
  path: '/',
  name: 'root',
  type: RoadMapType.fallen,
  component: (): any => {
    const rs = roads();
    return (
      <Redirect to={ rs?.welcome?.path } />
    );
  },
};

const initRoadMap: RoadMapModuleType = {
  welcome: {
    name: 'Demo',
    path: '/demo',
    component: () => <Redirect to='/demo/foroxy' />,
    subRoads: [
      {
        name: 'foroxy',
        path: '/foroxy',
        component: lazy(() => import('@/pages/Demo/Foroxy')),
      },
      {
        name: 'femo',
        path: '/femo',
        component: prepareData(lazy(() => import('../pages/Demo/Femo'))),
        prepare: (routeParams) => {
          const { location } = routeParams;
          const query = queryToObject<Femo.Query>(location.search, {
            name: '',
            condition: '',
          }, true);
          return femoService.getList(query);
        },
      }, {
        name: 'react hook',
        path: '/hook',
        component: lazy(() => import('../pages/Demo/Hook')),
      }, {
        name: 'loading',
        path: '/loading',
        component: lazy(() => import('../pages/Demo/Loading')),
      }, {
        name: 'benchmark',
        path: '/benchmark',
        component: lazy(() => import('../pages/Demo/Benchmark')),
      }, {
        name: 'test',
        path: '/test',
        component: lazy(() => import('../pages/Demo/Test')),
      },
      {
        name: 'suspense',
        path: '/suspense',
        component: lazy(() => import('../pages/Demo/Suspense')),
      }, {
        name: 'tearing',
        path: '/tearing',
        component: lazy(() => import('../pages/Demo/Tearing')),
      }, {
        name: 'ace editor',
        path: '/ace-editor',
        component: lazy(() => import('../pages/Demo/AceEditor')),
      }],
  },
  roadRoot,
};
// 操作的时直接提取值成数组 extractPagesRoadMapAsArray
roads = gluer(initRoadMap);
// 作为兜底的路由配置
// 将所有路由重定向到
export const road404: RoadMap = {
  name: '404',
  path: '*',
  component: (): ReactElement => <NotFound />,
  permissions: [], // 无权限要求
};

export default roads;
