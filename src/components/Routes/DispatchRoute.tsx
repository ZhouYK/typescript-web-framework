import React, { ReactChildren, useEffect, useState } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { road404, RoadMap } from '@src/pages/model/pagesRoadMap';
import store from "@src/store";

import UndertakeRoute from './UndertakeRoute';

interface Props extends RouteComponentProps {
  routes: RoadMap[];
  children?: ReactChildren;
}

const DispatchRoute = (props: Props) => {
  const [routes, routesUpdator] = useState(() => store.referToState(store.model.pagesRoadMap));
  // 后续UndertakeRoute中不会再校验road中第一层的权限
  const [tempRoutes, updateTempRoutes] = useState(() => (routes instanceof Array ? [...routes, road404] : [road404]));
  useEffect(() => store.subscribe([store.model.pagesRoadMap], (routes: RoadMap[]) => {
      updateTempRoutes(routes instanceof Array ? [...routes, road404] : [road404]);
      routesUpdator(routes);
    }), []);
  return (
    <Switch>
      { tempRoutes.map((road: RoadMap, index: number) => {
          return (
            <Route
              key={road.path}
              exact={false}
              path={road.path}
              render={(routeProps: RouteComponentProps) => (
                  <UndertakeRoute routes={routes} road={road} index={index} {...routeProps} />
                )}
            />
          );
        })
      }
    </Switch>
  );
};

export default DispatchRoute;
