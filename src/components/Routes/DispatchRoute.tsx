import React, {
 ReactElement, useEffect, useState,
} from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { road404, RoadMap } from '@src/pages/model/pagesRoadMap';
import store from '@src/store';

import UndertakeRoute from './UndertakeRoute';

const DispatchRoute = (_props: RouteComponentProps): ReactElement => {
  // 后续UndertakeRoute中不会再校验road中第一层的权限
  const [tempRoutes, updateTempRoutes] = useState((): RoadMap[] => {
    const routes = store.referToState(store.model.pagesRoadMap);
    return (routes instanceof Array ? [...routes, road404] : [road404]);
  });
  useEffect((): () => void => store.subscribe([store.model.pagesRoadMap], (routes: RoadMap[]): void => {
      updateTempRoutes(routes instanceof Array ? [...routes, road404] : [road404]);
    }), []);
  return (
    <Switch>
      { tempRoutes.map((road: RoadMap, index: number): ReactElement => (
            <Route
              key={road.path}
              exact={false}
              path={road.path}
              render={(routeProps: RouteComponentProps): ReactElement => {
                console.log('road：', road);
                return (
                  <UndertakeRoute road={road} index={index} {...routeProps} />
                );
              }}
            />
          ))
      }
    </Switch>
  );
};

export default DispatchRoute;
