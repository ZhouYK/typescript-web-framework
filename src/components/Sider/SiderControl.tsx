import { currentMatchRoad } from '@src/components/Routes/RoadMapDerivedModel';
import { extractPagesRoadMapAsArray } from '@src/pages/roadMapTool';
import React, {
  ReactElement,
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import pagesRoadMap from '@src/pages/roadMap';
import { useDerivedState, useModel } from 'femo';

import LeftSider from './index';

const SiderControl = (props: RouteComponentProps): ReactElement => {
  const [sider] = useDerivedState(() => extractPagesRoadMapAsArray(pagesRoadMap()), [pagesRoadMap]);

  const [currentRoad] = useModel(currentMatchRoad);

  return (
    currentRoad?.hasSider ? (
      <LeftSider history={props.history} location={props.location} match={props.match} sider={sider} />
    ) : null
  );
};

export default withRouter(SiderControl);
