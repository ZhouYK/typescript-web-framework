import React, {
  ReactElement,
} from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { flatRoadMap } from '@src/pages/roadMap';
import { RoadMap } from '@src/interface';
import { useDerivedState } from 'femo';

import UndertakeRoute from './UndertakeRoute';

const DispatchRoute = (): ReactElement => {
  const renderRoutes = (arr: RoadMap[]) => arr.map((road: RoadMap, index: number): ReactElement => (
    <Route
      key={road.path}
      exact={false}
      path={road.path}
      render={(routeProps: RouteComponentProps): ReactElement => (
        <UndertakeRoute road={road} index={index} {...routeProps} />
      )}
    />
  ));

  // 后续UndertakeRoute中不会再校验road中第一层的权限
  const [routeElements] = useDerivedState(() => renderRoutes(flatRoadMap()), [flatRoadMap]);

  return (
    <Switch>
      {
        routeElements
      }
    </Switch>
  );
};

export default DispatchRoute;
