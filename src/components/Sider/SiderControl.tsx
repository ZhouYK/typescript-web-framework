import { RoadMap } from '@src/interface';
import { extractPagesRoadMapAsArray } from '@src/pages/roadMapTool';
import React, {
  ReactElement, useState,
} from 'react';
import { pathToRegexp } from 'path-to-regexp';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import pagesRoadMap from '@src/pages/roadMap';
import { useBatchDerivedModel, useDerivedState } from 'femo';

import LeftSider from './index';
import './style.less';

interface WholeProps extends RouteComponentProps {
}

interface SimpleRoute {
  path: string;
  hasSider: boolean;
}

interface CurContext {
  flatSimpleRoutes: SimpleRoute[];
  matchedPathMap: Map<string, SimpleRoute[]>;
}

const SiderControl = (props: RouteComponentProps): ReactElement => {
  const { location } = props;

  const [curContext] = useState((): CurContext => ({
    flatSimpleRoutes: [],
    matchedPathMap: new Map(),
  }));

  const [sider] = useDerivedState(() => extractPagesRoadMapAsArray(pagesRoadMap()), [pagesRoadMap]);

  // 获取拍平的简单路由
  const getFlatSimpleRoutes = (roads: RoadMap[], path: string[] = [], parentHasSider = true): void => {
    // 第一次调用
    if (path.length === 0) {
      curContext.flatSimpleRoutes = [];
    }
    roads.forEach((item): void => {
      path.push(item.path);
      const keyPath = path.join('');
      let { hasSider } = item;
      if (typeof hasSider !== 'boolean') {
        hasSider = parentHasSider;
      }
      curContext.flatSimpleRoutes.push({
        path: keyPath,
        hasSider,
      });
      if (item.subPaths && item.subPaths.length !== 0) {
        getFlatSimpleRoutes(item.subPaths, path, hasSider);
      } else if (item.leafPaths && item.leafPaths.length !== 0) {
        getFlatSimpleRoutes(item.leafPaths, path, hasSider);
      }
      path.pop();
    });
  };

  const mainFn = (params: WholeProps): SimpleRoute[] => {
    const { location: { pathname } } = params;
    const { flatSimpleRoutes, matchedPathMap } = curContext;

    // 命中缓存，则直接返回
    if (matchedPathMap.has(pathname)) {
      return matchedPathMap.get(pathname);
    }
    const result = flatSimpleRoutes.filter((item: SimpleRoute): boolean => {
      const { path } = item;
      const re = pathToRegexp(path, [], { end: true });
      const result = re.exec(pathname);
      return !!result;
    });
    matchedPathMap.set(pathname, result);
    return result;
  };

  const getSiderShow = (p: RouteComponentProps) => {
    const arr = mainFn(p);
    // 由于是精确匹配，取数组第一个，遵守先匹配先生效的原则
    if (arr.length === 0) {
      return false;
    }
    const target = arr[0];
    return target.hasSider;
  };

  const [siderShow] = useBatchDerivedModel(() => {
    getFlatSimpleRoutes(sider);
    return getSiderShow(props);
  }, {
    source: location?.pathname,
    callback: (ns, ps, s) => {
      if (ns !== ps) return getSiderShow(props);
      return s;
    },
  }, {
    source: sider,
    callback: (ns, ps, s, prevStatus) => {
      const flag = ns !== ps;
      if (flag) {
        getFlatSimpleRoutes(sider);
        curContext.matchedPathMap.clear();
        if (!prevStatus.stateChanged) return getSiderShow(props);
      }
      return s;
    },
  });

  return (
    siderShow ? (
      <LeftSider history={props.history} location={props.location} match={props.match} sider={sider} />
    ) : null
  );
};

export default withRouter(SiderControl);
