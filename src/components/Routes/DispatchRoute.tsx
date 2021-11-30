import React, {
  ReactElement, useCallback,
} from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import pagesRoadMap, { road404 /* roadRoot */ } from '@src/pages/roadMap';
import { RoadMap, RoadMapModuleType } from '@src/interface';
import { extractPagesRoadMapAsArray } from '@src/pages/roadMapTool';
import { useDerivedState } from 'femo';

import UndertakeRoute from './UndertakeRoute';

const genRoutes = (routes: RoadMap[]): RoadMap[] => (routes instanceof Array ? [...routes, /* roadRoot, */road404] : [road404]);

const DispatchRoute = (): ReactElement => {
  const renderRoutes = useCallback((r: RoadMapModuleType) => {
    const tempRoutes: RoadMap[] = genRoutes(extractPagesRoadMapAsArray(r));
    return tempRoutes.map((road: RoadMap, index: number): ReactElement => (
      <Route
        key={road.path}
        exact={false}
        path={road.path}
        render={(routeProps: RouteComponentProps): ReactElement => (
          <UndertakeRoute road={road} index={index} {...routeProps} />
        )}
      />
    ));
  }, []);

  // 后续UndertakeRoute中不会再校验road中第一层的权限
  const [routeElements] = useDerivedState(() => renderRoutes(pagesRoadMap()), [pagesRoadMap]);

  return (
    <Switch>
      {
        routeElements
      }
    </Switch>
  );
};

export default DispatchRoute;
