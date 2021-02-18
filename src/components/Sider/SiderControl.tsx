import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { pathToRegexp } from 'path-to-regexp';
import { RouteComponentProps } from 'react-router-dom';
import { RoadMap, RoadMapModuleType } from '@src/pages/interface';
import { extractPagesRoadMapAsArray } from '@src/pages/aroundRoadMap';
import { RecordMenusFunc } from '@src/components/Sider/interface';
import pagesRoadMap from '@src/pages/roadMap';
import { subscribe } from 'femo';

import LeftSider from './index';
import './style.less';

interface WholeProps extends RouteComponentProps {
  sider: RoadMap[];
}

interface SimpleRoute {
  path: string;
  hasSider: boolean;
}

interface CurContext {
  cachedSider: RoadMap[];
  recordMenus: SimpleRoute[];
}

const genRenderMenus = (curContext: CurContext): RecordMenusFunc => {
  const renderRecordMenus = (menus: RoadMap[], path: string[] = [], parentHasSider = true): void => {
    // 第一次调用
    if (path.length === 0) {
      // 如果sider数据发生了更新才做重新渲染
      // 否则，从缓存中获取
      if (curContext.cachedSider === menus) {
        return;
      }
      curContext.recordMenus = [];
    }
    menus.forEach((item): void => {
      path.push(item.path);
      const keyPath = path.join('');
      let { hasSider } = item;
      if (typeof hasSider !== 'boolean') {
        hasSider = parentHasSider;
      }
      curContext.recordMenus.push({
        path: keyPath,
        hasSider,
      });
      if (item.subPaths && item.subPaths.length !== 0) {
        renderRecordMenus(item.subPaths, path, hasSider);
      } else if (item.leafPaths && item.leafPaths.length !== 0) {
        renderRecordMenus(item.leafPaths, path, hasSider);
      }
      path.pop();
    });
  };
  return renderRecordMenus;
};

const SiderControl = (props: RouteComponentProps): ReactElement => {
  const [curContext] = useState((): CurContext => ({
    cachedSider: [],
    recordMenus: [],
  }));

  const [sider, updateSider] = useState((): RoadMap[] => extractPagesRoadMapAsArray());

  useEffect((): () => void => subscribe([pagesRoadMap], (sider: RoadMapModuleType): void => {
    updateSider(extractPagesRoadMapAsArray(sider));
  }), []);

  const mainFn = useCallback((params: WholeProps): SimpleRoute[] => {
    // 渲染menus
    // 这里没有放入useEffect和useLayoutEffect是为了在属性发生变化的第一次渲染就得到最新的元素;它们时机滞后，不合适
    const renderFunc = genRenderMenus(curContext);

    const { sider, location } = params;
    renderFunc(sider);
    return curContext.recordMenus.filter((item: SimpleRoute): boolean => {
      const { path } = item;
      const re = pathToRegexp(path, [], { end: true });
      const result = re.exec(location.pathname);
      return !!result;
    });
  }, []);

  const [siderShow, siderShowUpdater] = useState((): boolean => {
    const arr = mainFn({ ...props, sider });
    // 由于是精确匹配，取数组第一个，遵守先匹配先生效的原则
    if (arr.length === 0) {
      return false;
    }
    const target = arr[0];
    return target.hasSider;
  });

  useEffect((): void => {
    const arr = mainFn({ ...props, sider });
    let result;
    // 由于是精确匹配，取数组第一个，遵守先匹配先生效的原则
    if (arr.length === 0) {
      result = false;
    } else {
      const target = arr[0];
      result = target.hasSider;
    }
    siderShowUpdater(result);
  }, [props.location.pathname, props.location.search, sider]);

  return (
    siderShow ? (
      <LeftSider history={props.history} location={props.location} match={props.match} sider={sider} />
    ) : null
  );
};

export default SiderControl;
