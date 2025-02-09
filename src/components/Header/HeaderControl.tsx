import { BreadcrumbName } from '@/components/Header/interface';
import useCurrentRoad from '@/components/Routes/currentRoad/useCurrentRoad';
import React, {
  ReactElement,
} from 'react';
import { useDerivedState } from 'femo';
import { withRouter, RouteComponentProps } from 'react-router';
import CusHeader from './index';

const HeaderControl = (props: RouteComponentProps): ReactElement => {
  const currentRoadMap = useCurrentRoad();
  const [breadcrumbData] = useDerivedState(() => {
    const breadcrumbs: BreadcrumbName[] = [];

    let current = currentRoadMap;
    let tempPath = '';
    while (current) {
      const tempName = current.name;
      tempPath = current.completePath;
      if (!tempName) {
        current = current.parent;
        continue;
      }
      breadcrumbs.unshift({
        completePath: tempPath,
        name: tempName,
      });
      current = current.parent;
    }
    return breadcrumbs;
  }, [currentRoadMap]);
  console.log('breadcrumbData', breadcrumbData);

  return currentRoadMap?.hasHeader ? <CusHeader breadcrumbNameMap={breadcrumbData} { ...props } /> : null;
};

export default withRouter(HeaderControl);
