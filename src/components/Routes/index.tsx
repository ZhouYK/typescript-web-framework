import React, { ReactElement, useState } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { road404 } from '@src/pages/roadMap';
import { RoadMap } from '@src/pages/interface';
import CrashPage from '@src/components/Crash';
import {
  CurContext, KeyPathItem, PermittedRouteFunc, SubSider,
} from './interface';

const genPermittedRoutesFn = (curContext: CurContext): PermittedRouteFunc => {
  const getPermittedRoutes = (
    roads: RoadMap[],
    path: string[] = [],
    subSider?: SubSider,
    parentHasSubSider = true,
    parentHasSider = true,
    parentFallback: (props: RouteComponentProps) => any = null,
  ): void => {
    if (path.length === 0) {
      // 如果routes数据发生了变化才去重新生成
      // 否则使用缓存数据
      if (curContext.cachedRoutes === roads) {
        return;
      }
      curContext.keyPaths = [];
    }
    roads.map((item): void => {
      path.push(item.path);
      const keyPath = path.join('');
      let { hasSubSider, hasSider, fallback } = item;
      // 如果自身没有设置hasSubSider则会由上层路由决定
      if (typeof hasSubSider !== 'boolean') {
        hasSubSider = parentHasSubSider;
      }
      if (typeof hasSider !== 'boolean') {
        hasSider = parentHasSider;
      }
      if (typeof fallback !== 'function') {
        fallback = parentFallback;
      }
      if (item.component) {
        const obj: KeyPathItem = {
          path: keyPath,
          component: item.component,
          hasSider,
          subSider,
          hasSubSider,
          access: item.access,
          fallback,
          authResult: item.authResult,
        };
        curContext.keyPaths.push(obj);
      }
      if (item.subPaths && item.subPaths.length !== 0) {
        getPermittedRoutes(item.subPaths, path, undefined, hasSubSider, hasSider, fallback);
      } else if (item.leafPaths && item.leafPaths.length !== 0) {
        if (path.length === 1) {
          getPermittedRoutes(
            item.leafPaths,
            path,
            { basePath: keyPath, subSider: item.leafPaths },
            hasSubSider,
            hasSider,
            fallback,
          );
        } else {
          getPermittedRoutes(item.leafPaths, path, subSider, hasSubSider, hasSider, fallback);
        }
      }
      path.pop();
    });
  };
  return getPermittedRoutes;
};

const genRenderRoutesFn = (curContext: CurContext, props: Props): (routes: RoadMap[]) => void => (routes: RoadMap[]): void => {
  if (curContext.cachedRoutes === routes) {
    return;
  }
  // fallbackRoad和404作为兜底
  // curContext.keyPaths.push(/* fallbackRoad, */road404);

  const finalRoutes = curContext.keyPaths.map((route: KeyPathItem): ReactElement => {
    if (route.access === false) {
      // 默认使用通用的404
      if (!route.fallback) {
        return null;
      }
      // 否则使用自定义的fallback逻辑
      return (
          <Route
            key={ route.path }
            exact
            path={ route.path }
            render={ (props: RouteComponentProps): any => {
              const result = route.fallback(props);
              return (
                <CrashPage>
                  {result || null}
                </CrashPage>
              );
            } }
          />
      );
    }
    if (route.hasSubSider && route.subSider) {
      return (
          <Route
            key={ route.path }
            exact
            path={ route.path }
            render={ (props: RouteComponentProps): ReactElement => {
              const Component = route.component;
              return (
                <CrashPage>
                  <Component { ...props } />
                </CrashPage>
              );
            } }
          />
      );
    }
    return <Route key={ route.path } exact path={ route.path } component={ (props: RouteComponentProps) => {
      const Component = route.component;
      return (
        <CrashPage>
          <Component { ...props } />
        </CrashPage>
      );
    }}/>;
  });
  const final404 = props.road404 || road404;
  const route404 = <Route key="404" path={ final404.path } component={ final404.component }/>;

  curContext.routeComponents = [...finalRoutes, route404];

  curContext.cachedRoutes = routes;
};

interface Props {
  road404?: RoadMap;
  routes: RoadMap[];
}

const Routes: React.FC<Props> = (props: Props): ReactElement => {
  const [curContext] = useState((): CurContext => ({
    keyPaths: [],
    cachedRoutes: [],
    routeComponents: [],
  }));

  // 生成path和component对应的路由配置数组
  // 不放在useEffect和useLayoutEffect中是因为他们执行时机是在渲染在浏览器生效后再触发，会触发第二次渲染
  // 这里需要在渲染之前就获取需要的结构
  // 同理renderRoutes
  const getPermittedRoutes = genPermittedRoutesFn(curContext);

  // 生成最终的路由组件数组
  const renderRoutes = genRenderRoutesFn(curContext, props);

  const { routes } = props;
  getPermittedRoutes(routes);
  renderRoutes(routes);

  return <Switch>{curContext.routeComponents}</Switch>;
};

export default Routes;
