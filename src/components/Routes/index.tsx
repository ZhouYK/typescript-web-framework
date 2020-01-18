import React, { useState } from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router';
import { queryToObject } from '@src/tools/util';
import { RoadMap, /* fallbackRoad, */ road404, QueryRoad } from '@src/pages/model/pagesRoadMap';
import { SubSider, KeyPathItem, CurContext } from './interface';

const genPermittedRoutesFn = (curContext: CurContext) => {
  // @ts-ignore
  const getPermittedRoutes = (
    roads: RoadMap[],
    path: string[] = [],
    subSider?: SubSider,
    parentHasSubSider: boolean = true,
    parentHasSider: boolean = true,
    parentFallback: (props: RouteComponentProps) => any = null,
  ) => {
    if (path.length === 0) {
      // 如果routes数据发生了变化才去重新生成
      // 否则使用缓存数据
      if (curContext.cachedRoutes === roads) {
        return;
      }
      curContext.keyPaths = [];
    }
    roads.map(item => {
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
          queries: item.queries,
          authResult: item.authResult,
        };
        curContext.keyPaths.push(obj);
      }
      if (item.subPaths && item.subPaths.length !== 0) {
        getPermittedRoutes(item.subPaths, path, undefined, hasSubSider, hasSider, fallback);
      } else if (item.leafPaths && item.leafPaths.length !== 0) {
        // 针对ats-x的菜单结构，做的特化处理
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
      return path.pop();
    });
  };
  return getPermittedRoutes;
};

const genRenderRoutesFn = (curContext: CurContext, props: Props) => {
  const renderRoutes = (routes: RoadMap[]): void => {
    if (curContext.cachedRoutes === routes) {
      return;
    }
    // fallbackRoad和404作为兜底
    // curContext.keyPaths.push(/* fallbackRoad, */road404);

    const finalRoutes = curContext.keyPaths.map((route: KeyPathItem) => {
      if (route.access === false) {
        // 默认使用通用的404
        if (!route.fallback) {
          return null;
        }
        // 否则使用自定义的fallback逻辑
        return (
          <Route
            key={route.path}
            exact
            path={route.path}
            render={(props: RouteComponentProps) => {
              const result = route.fallback(props);
              return result || null;
            }}
          />
        );
      }
      if (route.hasSubSider && route.subSider) {
        return (
          <Route
            key={route.path}
            exact
            path={route.path}
            render={(props: RouteComponentProps) => {
              // 针对queries进行判断
              // 如果queries中某一项access为false，且设置了fallback，那么判断其是否被匹配。如果被匹配了，则执行fallback
              if (route.queries) {
                const queryObj = queryToObject(props.location.search, {});
                for (let i = 0; i < route.queries.length; i += 1) {
                  const q: QueryRoad = route.queries[i];
                  // 因为这里是query，路由其实匹配了的，
                  // 强制要求fallback有效时才做特定渲染
                  if (q.access === false && q.fallback) {
                    const keys = Object.keys(q.key);
                    if (
                      (keys.length === 0 && Object.keys(queryObj).length === 0) ||
                      (keys.length !== 0 && keys.every((index: string) => index in queryObj))
                    ) {
                      const result = q.fallback(props);
                      return result || null;
                    }
                  }
                }
              }
              const Component = route.component;
              return <Component {...props} />;
            }}
          />
        );
      }
      return <Route key={route.path} exact path={route.path} component={route.component} />;
    });
    const final404 = props.road404 || road404;
    const route404 = <Route key="404" path={final404.path} component={final404.component} />;

    curContext.routeComponents = [...finalRoutes, route404];

    curContext.cachedRoutes = routes;
  };
  return renderRoutes;
};

interface Props {
  road404?: RoadMap;
  routes: RoadMap[];
}

const Routes: React.FC<Props> = (props: Props) => {
  // const { loadingStatus } = props;
  const [curContext] = useState(() => {
    const initial: CurContext = {
      keyPaths: [],
      cachedRoutes: [],
      routeComponents: [],
    };
    return initial;
  });

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
