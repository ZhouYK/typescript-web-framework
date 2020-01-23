import React, { ReactElement, useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import pathToRegexp from 'path-to-regexp';
import { RoadMap } from '@src/pages/model/pagesRoadMap';
import store from '@src/store';

import Header from './index';

const { useState } = React;

interface WholeProps extends RouteComponentProps {
  userRoadMap: RoadMap[];
}

interface SimpleRoute {
  path: string;
  hasHeader: boolean;
}

interface CurContext {
  cachedRoadMap: RoadMap[];
  recordRoads: SimpleRoute[];
}

const genRenderHeader = (curContext: CurContext): (menus: RoadMap[], path?: string[], parentHasHeader?: boolean) => void => {
  // @ts-ignore
  // eslint-disable-next-line consistent-return, func-names
  const renderRecordRoads = function (menus: RoadMap[], path: string[] = [], parentHasHeader: boolean = true): void {
    // 第一次调用
    if (path.length === 0) {
      // 如果sider数据发生了更新才做重新渲染
      // 否则，从缓存中获取
      if (curContext.cachedRoadMap === menus) {
        return;
      }
      curContext.recordRoads = [];
    }
    menus.forEach((item): void => {
      path.push(item.path);
      const keyPath = path.join('');
      let { hasHeader } = item;
      if (typeof hasHeader !== 'boolean') {
        hasHeader = parentHasHeader;
      }
      curContext.recordRoads.push({
        path: keyPath,
        hasHeader,
      });
      if (item.subPaths && item.subPaths.length !== 0) {
        renderRecordRoads(item.subPaths, path, hasHeader);
      } else if (item.leafPaths && item.leafPaths.length !== 0) {
        renderRecordRoads(item.leafPaths, path, hasHeader);
      }
      path.pop();
    });
  };
  return renderRecordRoads;
};

const HeaderControl = (props: RouteComponentProps): ReactElement => {
  const [curContext] = useState((): CurContext => ({
      cachedRoadMap: [],
      recordRoads: [],
    }));

  const [userRoadMap, updateUserRoadMap] = useState((): RoadMap[] => store.referToState(store.model.pagesRoadMap));

  useEffect((): () => void => store.subscribe([store.model.pagesRoadMap], (pagesRoadMap: RoadMap[]): void => {
      updateUserRoadMap(pagesRoadMap);
    }), []);

  const mainFn = useCallback((params: WholeProps): SimpleRoute[] => {
    // 渲染menus
    // 这里没有放入useEffect和useLayoutEffect是为了在属性发生变化的第一次渲染就得到最新的元素;它们时机滞后，不合适
    const renderHeader = genRenderHeader(curContext);

    const { userRoadMap, location } = params;
    renderHeader(userRoadMap);
    return curContext.recordRoads.filter((item: SimpleRoute): boolean => {
      const { path } = item;
      const re = pathToRegexp(path, [], { end: true });
      const result = re.exec(location.pathname);
      return !!result;
    });
  }, []);

  const [headerShow, headerShowUpdater] = useState((): boolean => {
    const arr = mainFn({ ...props, userRoadMap });
    // 由于是精确匹配，取数组第一个，遵守先匹配先生效的原则
    if (arr.length === 0) {
      return false;
    }
    const target = arr[0];
    return target.hasHeader;
  });

  useEffect((): void => {
    const arr = mainFn({ ...props, userRoadMap });
    let result;
    // 由于是精确匹配，取数组第一个，遵守先匹配先生效的原则
    if (arr.length === 0) {
      result = false;
    } else {
      const target = arr[0];
      result = target.hasHeader;
    }
    headerShowUpdater(result);
  }, [props.location.pathname, props.location.search, userRoadMap]);

  return headerShow ? <Header /> : null;
};

export default HeaderControl;
