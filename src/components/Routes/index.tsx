import {
  ComponentType, ReactElement, ReactNode, useState,
} from 'react';
import Index from '@src/components/Routes/RouteRender';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { road404 } from '@src/config/roads';
import { RoadMap } from '@src/config/interface';
import CrashPage from '@src/components/Crash';
import { useDerivedState } from 'femo';
import { CurContext, PermittedRouteFunc } from './interface';

interface Props {
  road404?: RoadMap;
  routes: RoadMap[];
}

const Routes: React.FC<Props> = (props: Props): ReactElement => {
  const { routes, road404: propRoad404 } = props;
  const [curContext] = useState(
    (): CurContext => ({
      keyPaths: [],
      routeComponents: [],
    }),
  );

  const getPermittedRoutes: PermittedRouteFunc = (roads: RoadMap[]): void => {
    roads.map((item): void => {
      if (item.component) {
        const obj: RoadMap = {
          ...item,
        };
        curContext.keyPaths.push(obj);
      }
      if (item.subRoads && item.subRoads.length !== 0) {
        getPermittedRoutes(item.subRoads);
      }
    });
  };

  // 生成最终的路由组件数组
  const renderRoutes = (notFoundRoad?: RoadMap): void => {
    // fallbackRoad和404作为兜底

    const finalRoutes = curContext.keyPaths.map((route: RoadMap): ReactElement | ReactNode => {
      if (route.access === false) {
        // 默认使用通用的404
        if (!route.fallback) {
          return null;
        }
        // 否则使用自定义的fallback逻辑
        return (
          <Route
            key={route.completePath}
            exact
            path={route.completePath}
            render={(props: RouteComponentProps): any => {
              const Fallback = route.fallback as ComponentType<any>;
              return (
                <CrashPage>
                  <Fallback {...props} />
                </CrashPage>
              );
            }}
          />
        );
      }
      return (
        <Route
          key={route.completePath}
          exact
          path={route.completePath}
          render={(props) => <Index {...props} road={route} />}
        />
      );
    });
    const final404 = notFoundRoad || road404;
    const route404 = <Route key="404" path={final404.path} component={final404.component} />;

    curContext.routeComponents = [...finalRoutes, route404];
  };

  useDerivedState(() => {
    curContext.keyPaths = [];
    getPermittedRoutes(routes);
    renderRoutes(propRoad404);
  }, [routes]);

  return <Switch>{curContext.routeComponents}</Switch>;
};

export default Routes;
