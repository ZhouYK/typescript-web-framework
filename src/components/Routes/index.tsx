import RouteRenderComponent from '@src/components/Routes/RouteRenderComponent';
import React, {
  ComponentType,
  ReactElement, useState,
} from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { road404 } from '@src/pages/roadMap';
import { RoadMap } from '@src/interface';
import CrashPage from '@src/components/Crash';
import { useDerivedState } from 'femo';
import {
  CurContext, PermittedRouteFunc,
} from './interface';

interface Props {
  road404?: RoadMap;
  routes: RoadMap[];
}

const Routes: React.FC<Props> = (props: Props): ReactElement => {
  const { routes, road404: propRoad404 } = props;
  const [curContext] = useState((): CurContext => ({
    keyPaths: [],
    routeComponents: [],
  }));

  // 生成path和component对应的路由配置数组
  // 不放在useEffect和useLayoutEffect中是因为他们执行时机是在渲染在浏览器生效后再触发，会触发第二次渲染
  // 这里需要在渲染之前就获取需要的结构
  // 同理renderRoutes
  const getPermittedRoutes: PermittedRouteFunc = (
    roads: RoadMap[],
    path: string[] = [],
    parentHasSubSider = true,
    parentHasSider = true,
    parentFallback: ComponentType<any>,
  ): void => {
    if (path.length === 0) {
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
        const obj: RoadMap = {
          ...item,
          path: keyPath,
          hasSider,
          hasSubSider,
          fallback,
        };
        curContext.keyPaths.push(obj);
      }
      if (item.subPaths && item.subPaths.length !== 0) {
        getPermittedRoutes(item.subPaths, path, hasSubSider, hasSider, fallback);
      } else if (item.leafPaths && item.leafPaths.length !== 0) {
        getPermittedRoutes(item.leafPaths, path, hasSubSider, hasSider, fallback);
      }
      path.pop();
    });
  };

  // 生成最终的路由组件数组
  const renderRoutes = (notFoundRoad?: RoadMap): void => {
    // fallbackRoad和404作为兜底
    // curContext.keyPaths.push(/* fallbackRoad, */road404);

    const finalRoutes = curContext.keyPaths.map((route: RoadMap): ReactElement => {
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
              const Fallback = route.fallback;
              return (
                <CrashPage>
                  <Fallback { ...props } />
                </CrashPage>
              );
            } }
          />
        );
      }
      return <Route key={ route.path } exact path={ route.path } render={(props) => <RouteRenderComponent { ...props } road={route} />} />;
    });
    const final404 = notFoundRoad || road404;
    const route404 = <Route key="404" path={ final404.path } component={ final404.component }/>;

    curContext.routeComponents = [...finalRoutes, route404];
  };

  useDerivedState(() => {
    getPermittedRoutes(routes);
    renderRoutes(propRoad404);
  }, [routes]);

  return <Switch>{curContext.routeComponents}</Switch>;
};

export default Routes;
