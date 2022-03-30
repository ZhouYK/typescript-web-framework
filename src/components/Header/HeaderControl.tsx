import { currentExactMatchedRoad } from '@src/components/Routes/roadMapDerivedModel';
import React, {
  ReactElement,
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useDerivedState, useModel } from 'femo';
import {
  queryToObject, variablePlaceholderReplace,
} from '@src/tools/util';
import CusHeader from './index';

const HeaderControl = (props: RouteComponentProps): ReactElement => {
  const [currentRoadMap] = useModel(currentExactMatchedRoad);
  const [breadcrumbData] = useDerivedState(() => {
    const breadcrumbs: { [index: string]: any } = {};

    let current = currentRoadMap;
    let tempPath = '';
    let tempName = '';
    while (current) {
      tempName = current.name;
      tempPath = `${current.completePath}${props.location.search}`;
      if (typeof tempName === 'string') {
        const queryObj = queryToObject(props.location.search, {}, false);
        tempName = variablePlaceholderReplace(tempName, queryObj);
      }
      breadcrumbs[tempPath] = tempName;
      current = current.parent;
    }
    return breadcrumbs;
  }, [currentRoadMap]);

  return currentRoadMap?.hasHeader ? <CusHeader breadcrumbNameMap={breadcrumbData} { ...props } /> : null;
};

export default withRouter(HeaderControl);
