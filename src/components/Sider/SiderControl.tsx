import React, {
  ReactElement, useCallback, useState,
} from 'react';
import { pathToRegexp } from 'path-to-regexp';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RoadMap } from '@src/pages/interface';
import { extractPagesRoadMapAsArray } from '@src/pages/aroundRoadMap';
import pagesRoadMap from '@src/pages/roadMap';
import { useDerivedState } from 'femo';
import { getSafe } from '@src/tools/util';

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

const SiderControl = (props: RouteComponentProps): ReactElement => {
  const [curContext] = useState((): CurContext => ({
    cachedSider: [],
    recordMenus: [],
  }));

  const [sider] = useDerivedState(() => extractPagesRoadMapAsArray(pagesRoadMap()), () => extractPagesRoadMapAsArray(pagesRoadMap()), [pagesRoadMap]);

  // 渲染menus
  const renderFunc = useCallback((menus: RoadMap[], path: string[] = [], parentHasSider = true): void => {
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
        renderFunc(item.subPaths, path, hasSider);
      } else if (item.leafPaths && item.leafPaths.length !== 0) {
        renderFunc(item.leafPaths, path, hasSider);
      }
      path.pop();
    });
  }, []);

  const mainFn = useCallback((params: WholeProps): SimpleRoute[] => {
    const { sider, location } = params;
    renderFunc(sider);
    return curContext.recordMenus.filter((item: SimpleRoute): boolean => {
      const { path } = item;
      const re = pathToRegexp(path, [], { end: true });
      const result = re.exec(location.pathname);
      return !!result;
    });
  }, []);

  const getSiderShow = useCallback((p: RouteComponentProps) => {
    const arr = mainFn({ ...p, sider });
    // 由于是精确匹配，取数组第一个，遵守先匹配先生效的原则
    if (arr.length === 0) {
      return false;
    }
    const target = arr[0];
    return target.hasSider;
  }, []);

  const [siderShow] = useDerivedState(() => getSiderShow(props), () => getSiderShow(props), [getSafe(props, 'location.pathname'), getSafe(props, 'location.search'), sider]);

  return (
    siderShow ? (
      <LeftSider history={props.history} location={props.location} match={props.match} sider={sider} />
    ) : null
  );
};

export default withRouter(SiderControl);
