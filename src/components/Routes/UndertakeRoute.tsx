import React, {
 FC, Suspense, useEffect, useState,
} from 'react';
import { RouteComponentProps } from 'react-router';
import classnames from 'classnames';
import { RoadMap } from '@src/pages/model/pagesRoadMap';
import Routes from './index';
import SubSiderControl from '../SubSider/SubSiderControl';
import { isolatePage } from '../HOC';

interface Props extends RouteComponentProps {
  road: RoadMap;
  routes: RoadMap[];
  index: number;
}

const UndertakeRoute: FC<Props> = (props: Props) => {
  const {
    road, routes: userRoadMap, index, ...routeProps
  } = props;

  const [routes, routesUpdater] = useState([road]);

  useEffect(() => {
    routesUpdater([road]);
  }, [road]);
  const loadingEl = <div>加载中</div>;

  return (
    <>
      <SubSiderControl sider={routes} {...routeProps} />
      <main
        className={classnames('zyk-route-content')}
      >
        <Suspense fallback={loadingEl}>
          <Routes routes={routes} />
        </Suspense>
      </main>
    </>
  );
};

export default isolatePage(UndertakeRoute);
