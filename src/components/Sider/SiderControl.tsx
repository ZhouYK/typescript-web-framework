import { currentExactMatchedRoad } from '@src/components/Routes/roadMapDerivedModel';
import React, {
  ReactElement,
} from 'react';
import { flatRoadMap } from '@src/pages/roadMap';
import { useModel } from 'femo';

import LeftSider from './index';

const SiderControl = (): ReactElement => {
  const [sider] = useModel(flatRoadMap);
  console.log('刷新');

  const [currentRoad] = useModel(currentExactMatchedRoad);

  return (
    currentRoad?.hasSider ? (
      <LeftSider currentRoad={currentRoad} sider={sider} />
    ) : null
  );
};

export default SiderControl;
