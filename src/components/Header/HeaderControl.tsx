import React, {
  ReactElement, useCallback, useEffect,
} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { pathToRegexp } from 'path-to-regexp';
import { RoadMap, RoadMapModuleType } from '@src/pages/interface';
import roads from '@src/pages/roadMap';
import { subscribe } from 'femo';
import { extractPagesRoadMapAsArray } from '@src/pages/aroundRoadMap';
import { CurContext, SimpleRoute, WholeProps } from '@src/components/Header/interface';
import {
  queryToObject, variablePlaceholderReplace,
} from '@src/tools/util';
import MisHeader from './index';

const { useState } = React;


const genRenderHeader = (curContext: CurContext): (menus: RoadMap[], path?: string[], parentHasHeader?: boolean) => void => {
  const renderRecordRoads = function (menus: RoadMap[], path: string[] = [], parentHasHeader = true): void {
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
        externUrl: item.externUrl,
        realPath: item.realPath,
        path: keyPath,
        hasHeader,
        name: item.name,
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

  const [userRoadMap, updateUserRoadMap] = useState((): RoadMap[] => extractPagesRoadMapAsArray());
  const [breadcrumbData, updateBreadcrumbData] = useState({});

  useEffect(() => subscribe([roads], (pagesRoadMap: RoadMapModuleType): void => {
    updateUserRoadMap(extractPagesRoadMapAsArray(pagesRoadMap));
  }), []);

  const mainFn = useCallback((params: WholeProps): SimpleRoute[] => {
    // 渲染menus
    // 这里没有放入useEffect和useLayoutEffect是为了在属性发生变化的第一次渲染就得到最新的元素;它们时机滞后，不合适
    const renderHeader = genRenderHeader(curContext);

    const { userRoadMap, location } = params;
    renderHeader(userRoadMap);
    const breadcrumbs: { [index: string]: any } = {};
    const arrMatch = curContext.recordRoads.filter((item: SimpleRoute): boolean => {
      const { path } = item;
      const breadcrumbRe = pathToRegexp(path, [], { end: false });
      const breadcrumbResult = breadcrumbRe.exec(location.pathname);
      // 如果未设置名字，则不展示
      // 有externUrl也不展示
      if (breadcrumbResult && item.name && !(item.externUrl)) {
        let tempName = item.name;
        const tempPath = `${item.realPath || item.path}${props.location.search}`;
        // 如果是string，则进行匹配处理
        if (typeof tempName === 'string') {
          const queryObj = queryToObject(props.location.search, {}, false);
          tempName = variablePlaceholderReplace(tempName, queryObj);
        }
        if (tempPath in breadcrumbs) {
          const value = breadcrumbs[tempPath];
          if (!(value instanceof Array)) {
            breadcrumbs[tempPath] = [value, tempName];
          } else {
            breadcrumbs[tempPath] = [...value, tempName];
          }
        } else {
          breadcrumbs[tempPath] = tempName;
        }
      }
      const re = pathToRegexp(path, [], { end: true });
      const result = re.exec(location.pathname);
      return !!result;
    });
    updateBreadcrumbData(breadcrumbs);
    return arrMatch;
  }, [props.location]);


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

  return headerShow ? <MisHeader breadcrumbNameMap={breadcrumbData} { ...props } /> : null;
};

export default HeaderControl;
