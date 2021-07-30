import {
  FC, ReactElement, Suspense, useEffect, useState,
} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { RoadMap } from '@src/pages/interface';
import Spinner from '@src/components/Spinner';
import Routes from './index';

interface Props extends RouteComponentProps {
  road: RoadMap;
  index: number;
}

const UndertakeRoute: FC<Props> = (props: Props): ReactElement => {
  const {
    road,
  } = props;

  const [routes, routesUpdater] = useState([road]);

  useEffect((): void => {
    routesUpdater([road]);
  }, [road]);
  const loadingEl = <Spinner />;

  return (
    <Suspense fallback={loadingEl}>
      <Routes routes={routes} />
    </Suspense>
  );
};

export default UndertakeRoute;
