import NotFound from '@src/components/NotFound';
import { RoadMap, RoadMapModuleType, RoadMapType } from '@src/interface';
import { Femo } from '@src/pages/Demo/Femo/interface';
import femoService from '@src/pages/Demo/Femo/service';
import { queryToObject } from '@src/tools/util';
import { gluer } from 'femo';
import { lazy, ReactElement } from 'react';
import { Redirect } from 'react-router-dom';

/*
 * 根路径的路由
 * */

export const roadRoot: RoadMap = {
  path: '/',
  name: 'root',
  type: RoadMapType.fallen,
  component: (): any => {
    const roads = roadMap();
    return (
      <Redirect to={ roads?.welcome?.path } />
    );
  },
};

const initRoadMap: RoadMapModuleType = {
  welcome: {
    name: 'Demo',
    path: '/demo',
    component: () => <Redirect to='/demo/femo' />,
    subRoads: [{
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
    }, {
      name: 'test',
      path: '/test',
      component: lazy(() => import('./Demo/Test')),
    }],
  },
  roadRoot,
};
// 操作的是直接提取值成数组 extractPagesRoadMapAsArray
const roadMap = gluer(initRoadMap);

// 处理flatRoadMap的方法
const completeFn = (roads: RoadMap[], path: string[] = [], parent: RoadMap = null) => {
  let hasLivingRoadInSubRoads = false;
  const result = roads.map((item) => {
    const tempItem = {
      ...item,
    };
    path.push(tempItem.path);
    const keyPath = path.join('');
    // mutable方式增加parent，便于通过匹配的精确路由回溯
    tempItem.parent = parent;
    const {
      hasSider, hasHeader, fallback, type,
    } = tempItem;
    if (typeof hasSider !== 'boolean') {
      tempItem.hasSider = parent?.hasSider ?? true;
    }
    if (typeof hasHeader !== 'boolean') {
      tempItem.hasHeader = parent?.hasHeader ?? true;
    }
    if (typeof fallback !== 'function') {
      tempItem.fallback = parent?.fallback;
    }
    // 设置默认值为 living
    if (type !== RoadMapType.living && type !== RoadMapType.fallen) {
      tempItem.type = parent?.type ?? RoadMapType.living;
    }

    if (!hasLivingRoadInSubRoads && tempItem.type === RoadMapType.living) {
      hasLivingRoadInSubRoads = true;
    }
    tempItem.completePath = keyPath;
    if (tempItem.subRoads && tempItem.subRoads.length !== 0) {
      tempItem.subRoads = completeFn(tempItem.subRoads, path, tempItem);
    }
    path.pop();
    return tempItem;
  });
  if (parent) {
    parent.hasLivingRoadInSubRoads = hasLivingRoadInSubRoads;
  }
  return result;
};

// 扁平的RoadMap，是roadMap的缓存
// 不要直接更新这个flatRoadMap
// 请更新roadMap来达到更新flagRoadMap的目的
export const flatRoadMap = gluer<RoadMap[]>(completeFn(Object.values(roadMap())));
flatRoadMap.relyOn([roadMap], (result) => completeFn(Object.values(result[0])));
// 作为兜底的路由配置
// 将所有路由重定向到
export const road404: RoadMap = {
  name: '404',
  path: '*',
  component: (): ReactElement => <NotFound />,
  permissions: [], // 无权限要求
};

export default roadMap;
