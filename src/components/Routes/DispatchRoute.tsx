import Crash from '@/components/Crash';
import useFlatRoads from '@/config/useFlatRoads';
import { ReactElement } from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { RoadMap } from '@/config/interface';
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

  const flatRoutes = useFlatRoads();
  // 后续UndertakeRoute中不会再校验road中第一层的权限
  const [routeElements] = useDerivedState(() => renderRoutes(flatRoutes), [flatRoutes]);

  return (
    <Crash>
      <Switch>{routeElements}</Switch>
    </Crash>
  );
};

export default DispatchRoute;
