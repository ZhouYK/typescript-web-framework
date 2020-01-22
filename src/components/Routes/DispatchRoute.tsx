import React, {
 ReactElement, useEffect, useState,
} from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { road404, RoadMap } from '@src/pages/model/pagesRoadMap';
import store from '@src/store';

import UndertakeRoute from './UndertakeRoute';

const DispatchRoute = (): ReactElement => {
  const [routes, routesUpdator] = useState((): RoadMap[] => store.referToState(store.model.pagesRoadMap));
  // 后续UndertakeRoute中不会再校验road中第一层的权限
  const [tempRoutes, updateTempRoutes] = useState((): RoadMap[] => (routes instanceof Array ? [...routes, road404] : [road404]));
  useEffect((): () => void => store.subscribe([store.model.pagesRoadMap], (routes: RoadMap[]): void => {
      updateTempRoutes(routes instanceof Array ? [...routes, road404] : [road404]);
      routesUpdator(routes);
    }), []);
  return (
    <Switch>
      { tempRoutes.map((road: RoadMap, index: number): ReactElement => (
            <Route
              key={road.path}
              exact={false}
              path={road.path}
              render={(routeProps: RouteComponentProps): ReactElement => (
                  <UndertakeRoute road={road} index={index} {...routeProps} />
                )}
            />
          ))
      }
    </Switch>
  );
};

export default DispatchRoute;
