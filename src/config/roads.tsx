import NotFound from '@/components/NotFound';
import { RoadMap, RoadMapModuleType, RoadMapType } from '@/config/interface';
import { FemoModel, glue } from 'femo';
import { lazy, ReactElement } from 'react';
import { Redirect } from 'react-router-dom';

/*
 * 根路径的路由
 * */
// eslint-disable-next-line
let roads: FemoModel<RoadMapModuleType>;
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
    component: lazy(() => import('@/pages/Demo')),
  },
  home: {
    name: 'Home',
    path: '/home',
    component: lazy(() => import('@/pages/Home')),
  },
  roadRoot,
};
// 操作的时直接提取值成数组 extractPagesRoadMapAsArray
roads = glue(initRoadMap);
// 作为兜底的路由配置
// 将所有路由重定向到
export const road404: RoadMap = {
  name: '404',
  path: '*',
  component: (): ReactElement => <NotFound />,
  permissions: [], // 无权限要求
};

export default roads;
