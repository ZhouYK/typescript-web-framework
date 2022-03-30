import { BreadcrumbName } from '@src/components/Header/interface';
import { currentExactMatchedRoad } from '@src/components/Routes/roadMapDerivedModel';
import React, {
  ReactElement,
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useDerivedState, useModel } from 'femo';
import CusHeader from './index';

const HeaderControl = (props: RouteComponentProps): ReactElement => {
  const [currentRoadMap] = useModel(currentExactMatchedRoad);
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

  return currentRoadMap?.hasHeader ? <CusHeader breadcrumbNameMap={breadcrumbData} { ...props } /> : null;
};

export default withRouter(HeaderControl);
