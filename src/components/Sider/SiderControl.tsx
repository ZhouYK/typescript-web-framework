import React, { useCallback, useEffect, useState } from 'react';
import { pathToRegexp } from 'path-to-regexp';
import { RouteComponentProps } from 'react-router';
import { RoadMap } from '@src/pages/model/pagesRoadMap';
import store from '@src/store';

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

const genRenderMenus = (curContext: CurContext) => {
  // @ts-ignore
  // eslint-disable-next-line consistent-return, func-names
  const renderRecordMenus = function (menus: RoadMap[], path: string[] = [], parentHasSider: boolean = true) {
    // 第一次调用
    if (path.length === 0) {
      // 如果sider数据发生了更新才做重新渲染
      // 否则，从缓存中获取
      if (curContext.cachedSider === menus) {
        return curContext.recordMenus;
      }
      curContext.recordMenus = [];
    }
    menus.forEach((item) => {
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

const SiderControl = (props: RouteComponentProps) => {
  const [curContext] = useState(() => {
    const initial: CurContext = {
      cachedSider: [],
      recordMenus: [],
    };
    return initial;
  });

  const [sider, updateSider] = useState(() => store.referToState(store.model.pagesRoadMap));

  useEffect(() => store.subscribe([store.model.pagesRoadMap], (sider: RoadMap[]) => {
      updateSider(sider);
    }), []);

  const mainFn = useCallback((params: WholeProps) => {
    // 渲染menus
    // 这里没有放入useEffect和useLayoutEffect是为了在属性发生变化的第一次渲染就得到最新的元素;它们时机滞后，不合适
    const renderRecordMenus = genRenderMenus(curContext);

    const { sider, location } = params;
    renderRecordMenus(sider);
    const arr = curContext.recordMenus.filter((item: SimpleRoute) => {
      const { path } = item;
      const re = pathToRegexp(path, [], { end: true });
      const result = re.exec(location.pathname);
      return !!result;
    });
    return arr;
  }, []);

  // @ts-ignore
  const [siderShow, siderShowUpdater] = useState(() => {
    const arr = mainFn({ ...props, sider });
    // 由于是精确匹配，取数组第一个，遵守先匹配先生效的原则
    if (arr.length === 0) {
      return false;
    }
    const target = arr[0];
    return target.hasSider;
  });

  useEffect(() => {
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

  return siderShow ? (
    <LeftSider history={props.history} location={props.location} match={props.match} sider={sider} />
  ) : null;
};

export default SiderControl;
