import {
  lazy,
  ReactElement,
} from 'react';
import { RoadMap, RoadMapModuleType } from '@src/interface';
import { gluer } from 'femo';
import NotFound from '@src/components/NotFound';
import { Redirect } from 'react-router-dom';
import { queryToObject } from '@src/tools/util';
import { Femo } from '@src/pages/Demo/Femo/interface';
import femoService from '@src/pages/Demo/Femo/service';

export interface Key {
  [index: string]: any;
}

const initRoadMap: RoadMapModuleType = {
  welcome: {
    name: 'Demo',
    path: '/demo',
    component: () => <Redirect to='/demo/femo' />,
    subPaths: [{
      name: 'femo',
      path: '/femo',
      component: lazy(() => import('./Demo/Femo')),
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
      component: lazy(() => import('./Demo/Hook')),
    }, {
      name: 'loading',
      path: '/loading',
      component: lazy(() => import('./Demo/Loading')),
    }, {
      name: 'benchmark',
      path: '/benchmark',
      component: lazy(() => import('./Demo/Benchmark')),
    }],
  },
};
// 操作的是直接提取值成数组 extractPagesRoadMapAsArray
const roadMap = gluer(initRoadMap);

// 扁平的RoadMap，是roadMap的缓存
// 不要直接更新这个flatRoadMap
// 请更新roadMap来达到更新flagRoadMap的目的
export const flatRoadMap = gluer<RoadMap[]>((_d, s) => {
  const completeFn = (roads: RoadMap[], path: string[] = [], parent: RoadMap = null) => roads.map((item) => {
    const tempItem = {
      ...item,
    };
    path.push(tempItem.path);
    const keyPath = path.join('');
    // mutable方式增加parent，便于通过匹配的精确路由回溯
    tempItem.parent = parent;
    const { hasSider, hasHeader, fallback } = tempItem;
    if (typeof hasSider !== 'boolean') {
      tempItem.hasSider = parent?.hasSider ?? true;
    }
    if (typeof hasHeader !== 'boolean') {
      tempItem.hasHeader = parent?.hasHeader ?? true;
    }
    if (typeof fallback !== 'function') {
      tempItem.fallback = parent?.fallback;
    }
    tempItem.completePath = keyPath;
    if (tempItem.subPaths && tempItem.subPaths.length !== 0) {
      tempItem.subPaths = completeFn(tempItem.subPaths, path, tempItem);
    } else if (tempItem.leafPaths && tempItem.leafPaths.length !== 0) {
      tempItem.leafPaths = completeFn(tempItem.leafPaths, path, tempItem);
    }
    path.pop();
    return tempItem;
  });
  return completeFn(s);
}, Object.values(roadMap()));
flatRoadMap.relyOn([roadMap], (result) => Object.values(result[0]));

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
      <Redirect to={ roads?.welcome?.path } />
    );
  },
};

export default roadMap;
