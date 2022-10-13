import useCurrentRoad from '@/components/Routes/currentRoad/useCurrentRoad';
import useFlatRoads from '@/config/useFlatRoads';
import React from 'react';

import LeftSider from './index';

const SiderControl = () => {
  const sider = useFlatRoads();
  const currentRoad = useCurrentRoad();

  return currentRoad?.hasSider ? <LeftSider currentRoad={currentRoad} sider={sider} /> : null;
};

export default SiderControl;
