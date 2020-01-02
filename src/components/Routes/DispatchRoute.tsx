import React, { ReactChildren, useEffect, useState } from 'react';
import { get, isArray } from 'lodash';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { connect } from 'dva';
import { Dispatch } from 'redux';

import UndertakeRoute from './UndertakeRoute';
import { road404, RoadMap } from '../../pages/pagesRoadMap';
import { UserInfo } from '../../models/userInfo';
import { DvaProps } from './interface';

interface Props extends RouteComponentProps {
  dispatch: Dispatch;
  routes: RoadMap[];
  children?: ReactChildren;
}

const DispatchRoute = (props: Props) => {
  const genRoutes = () => (isArray(props.routes) ? [...props.routes, road404] : [road404]);
  // 后续UndertakeRoute中不会再校验road中第一层的权限
  const [tempRoutes, updateTempRoutes] = useState(() => genRoutes());
  useEffect(() => {
    updateTempRoutes(genRoutes());
  }, [props.routes]);
  const routes = tempRoutes.map((road: RoadMap, index: number) => {
    return (
      <Route
        key={road.path}
        exact={false}
        path={road.path}
        render={(routeProps: RouteComponentProps) => {
          return (
            <UndertakeRoute routes={props.routes} dispatch={props.dispatch} road={road} index={index} {...routeProps} />
          );
        }}
      />
    );
  });
  return <Switch>{routes}</Switch>;
};

const mapStateToProps = (state: { userInfo: UserInfo }): DvaProps => {
  const routes = get(state, 'userInfo.userRoadMap', []) || [];
  return {
    routes,
  };
};
export default withRouter(connect(mapStateToProps)(DispatchRoute));
