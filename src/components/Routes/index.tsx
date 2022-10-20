import currentRoad from '@/components/Routes/currentRoad/model';
import {
  FC,
  ReactElement, ReactNode, useState,
} from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { road404 } from '@/config/roads';
import { RoadMap } from '@/config/interface';
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
      componentMap: new Map(),
    }),
  );

  const getPermittedRoutes: PermittedRouteFunc = (roads: RoadMap[]): void => {
    roads.map((item): void => {
      if (item.component) {
        const obj: RoadMap = {
          ...item,
        };
        curContext.keyPaths.push(obj);
        const { completePath } = obj;
        const genComponent = () => {
          const ResultComponent: FC<RouteComponentProps> = (props) => {
            currentRoad(curContext.componentMap.get(completePath).obj);
            const Component = obj.component;
            return (
              <Component {...props} />
            );
          };
          ResultComponent.displayName = obj.component.displayName;
          return ResultComponent;
        };
        if (curContext.componentMap.has(completePath)) {
          const curResult = curContext.componentMap.get(completePath);
          curResult.obj = obj;
          if (!Object.is(obj.component, curResult.origin)) {
            curResult.result = genComponent();
            curResult.origin = obj.component;
          }
        } else {
          curContext.componentMap.set(completePath, {
            result: genComponent(),
            origin: obj.component,
            obj,
          });
        }
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
            component={route.fallback}
          />
        );
      }
      return (
        <Route
          key={route.completePath}
          exact
          path={route.completePath}
          component={curContext.componentMap.get(route.completePath).result}
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
