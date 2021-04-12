import React, {
  ReactElement, useEffect, useState,
} from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import pagesRoadMap, { road404, roadRoot } from '@src/pages/roadMap';
import { RoadMap, RoadMapModuleType } from '@src/pages/interface';
import { extractPagesRoadMapAsArray } from '@src/pages/aroundRoadMap';
import { subscribe } from 'femo';

import UndertakeRoute from './UndertakeRoute';

const genRoutes = (routes: RoadMap[]): RoadMap[] => (routes instanceof Array ? [...routes, roadRoot, road404] : [road404]);

const DispatchRoute = (_props: RouteComponentProps): ReactElement => {
  // 后续UndertakeRoute中不会再校验road中第一层的权限
  const [tempRoutes, updateTempRoutes] = useState((): RoadMap[] => genRoutes(extractPagesRoadMapAsArray()));
  useEffect((): () => void => subscribe([pagesRoadMap], (routes: RoadMapModuleType): void => {
    updateTempRoutes(genRoutes(extractPagesRoadMapAsArray(routes)));
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
