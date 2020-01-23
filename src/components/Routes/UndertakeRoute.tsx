import React, {
  FC, ReactElement, Suspense, useEffect, useState,
} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import classnames from 'classnames';
import { RoadMap } from '@src/pages/model/pagesRoadMap';
import Routes from './index';
import SubSiderControl from '../SubSider/SubSiderControl';

interface Props extends RouteComponentProps {
  road: RoadMap;
  index: number;
}

const UndertakeRoute: FC<Props> = (props: Props): ReactElement => {
  const {
    road, ...routeProps
  } = props;

  const [routes, routesUpdater] = useState([road]);

  useEffect((): void => {
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

export default UndertakeRoute;
