import { RouteComponentProps } from 'dva/router';
import React, { useCallback, useEffect } from 'react';
import pathToRegexp from 'path-to-regexp';
import LeftSubSider from './index';
import { SubSider } from '../Routes/interface';
import { RoadMap } from '../../pages/model/pagesRoadMap';
import './style.less';

const { useState } = React;

interface Props {
  sider: RoadMap[];
}

interface WholeProps extends Props, RouteComponentProps {}

interface SimpleRoute {
  path: string;
  hasSider: boolean;
  subSider: SubSider;
  hasSubSider: boolean;
}

interface CurContext {
  cachedSider: RoadMap[];
  recordMenus: SimpleRoute[];
}

const genRenderMenus = (curContext: CurContext) => {
  // @ts-ignore
  // eslint-disable-next-line consistent-return, func-names
  const renderRecordMenus = function(
    menus: RoadMap[],
    path: string[] = [],
    subSider?: SubSider,
    parentHasSider: boolean = true,
    parentHasSubSider: boolean = true,
  ) {
    // 第一次调用
    if (path.length === 0) {
      // 如果sider数据发生了更新才做重新渲染
      // 否则，从缓存中获取
      if (curContext.cachedSider === menus) {
        return curContext.recordMenus;
      }
      curContext.recordMenus = [];
    }

    menus.forEach(item => {
      path.push(item.path);
      const keyPath = path.join('');
      let { hasSider, hasSubSider } = item;
      if (typeof hasSider !== 'boolean') {
        hasSider = parentHasSider;
      }
      if (typeof hasSubSider !== 'boolean') {
        hasSubSider = parentHasSubSider;
      }

      curContext.recordMenus.push({
        path: keyPath,
        subSider,
        hasSider,
        hasSubSider,
      });
      if (item.subPaths && item.subPaths.length !== 0) {
        renderRecordMenus(item.subPaths, path, subSider, hasSider, hasSubSider);
      } else if (item.leafPaths && item.leafPaths.length !== 0) {
        // 针对ats-x中leafPaths是作为第二级菜单存在
        if (path.length === 1) {
          renderRecordMenus(
            item.leafPaths,
            path,
            { basePath: keyPath, subSider: item.leafPaths },
            hasSider,
            hasSubSider,
          );
        } else {
          renderRecordMenus(item.leafPaths, path, subSider, hasSider, hasSubSider);
        }
      }
      path.pop();
    });
  };
  return renderRecordMenus;
};

const SiderControl = (props: WholeProps) => {
  const [curContext] = useState(() => {
    const initial: CurContext = {
      cachedSider: [],
      recordMenus: [],
    };
    return initial;
  });

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
  const [targetSider, siderUpdater] = useState(() => {
    const arr = mainFn(props);
    // 由于是精确匹配，取数组第一个，遵守先匹配先生效的原则
    if (arr.length === 0) {
      return {
        hasSubSider: false,
        hasSider: false,
        path: '',
        subSider: null,
      };
    }
    const target = arr[0];
    return target;
  });

  useEffect(() => {
    const arr = mainFn(props);
    let result: SimpleRoute;
    // 由于是精确匹配，取数组第一个，遵守先匹配先生效的原则
    if (arr.length === 0) {
      result = {
        hasSubSider: false,
        hasSider: false,
        path: '',
        subSider: null,
      };
    } else {
      const target = arr[0];
      result = target;
    }
    siderUpdater(result);
  }, [props.location.pathname, props.location.search, props.sider]);

  return targetSider.subSider && targetSider.hasSubSider ? (
    <LeftSubSider
      history={props.history}
      location={props.location}
      match={props.match}
      hasSider={targetSider.hasSider}
      sider={targetSider.subSider}
    />
  ) : null;
};

export default SiderControl;
