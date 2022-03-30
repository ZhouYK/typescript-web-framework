import { currentMatchRoad } from '@src/components/Routes/roadMapDerivedModel';
import React, {
  ReactElement,
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { flatRoadMap } from '@src/pages/roadMap';
import { useModel } from 'femo';

import LeftSider from './index';

const SiderControl = (props: RouteComponentProps): ReactElement => {
  const [sider] = useModel(flatRoadMap);

  const [currentRoad] = useModel(currentMatchRoad);

  return (
    currentRoad?.hasSider ? (
      <LeftSider history={props.history} location={props.location} match={props.match} sider={sider} />
    ) : null
  );
};

export default withRouter(SiderControl);
