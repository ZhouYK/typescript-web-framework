import React, { FC, Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { get, uniq } from 'lodash';
import { RouteComponentProps } from 'react-router';
import classnames from 'classnames';
import qs from 'querystringify';
import { Key, traverseToGetKey } from '@src/pages/atoms';
import { checkAuth } from '@src/api/auth';
import { getFeatureList } from '@src/api/common';
import { enhancedFindUserRoadMap } from '@src/utils/auth';
import { Dispatch } from 'redux';
import { RoadMap } from '../../pages/pagesRoadMap';
import Routes from './index';
import Loading from '../Loading';
import SubSiderControl from '../SubSider/SubSiderControl';
import { isolatePage } from '../HOC';

interface Props extends RouteComponentProps {
  road: RoadMap;
  dispatch: Dispatch;
  routes: RoadMap[];
  index: number;
}

const UndertakeRoute: FC<Props> = (props: Props) => {
  const { road, routes: userRoadMap, dispatch, index, ...routeProps } = props;

  const [routes, routesUpdater] = useState([road]);

  useEffect(() => {
    routesUpdater([road]);
  }, [road]);

  useEffect(() => {
    let roadArr: RoadMap[] = [];
    const hasLeafPaths = 'leafPaths' in road;
    const hasSubPaths = 'subPaths' in road;
    if (hasLeafPaths) {
      roadArr = get(road, 'leafPaths') || [];
    } else if (hasSubPaths) {
      roadArr = get(road, 'subPaths') || [];
    }
    const subsiderCodes = traverseToGetKey(roadArr, Key.permissions);
    const grayFeatureList = traverseToGetKey(roadArr, Key.grayFeature);
    const shouldRequestAuth = !!subsiderCodes.length;
    const shouldRequestGrayList = !!grayFeatureList.length;
    const p1 = shouldRequestAuth
      ? checkAuth(uniq([...subsiderCodes]), {
          cache: true,
        })
          .then(res => {
            return get(res, 'data.check_result_list[0].atom_result_map') || {};
          })
          .catch(() => {
            return {};
          })
      : {};
    const p2: any[] | Promise<any> = shouldRequestGrayList
      ? getFeatureList()
          .then(res => {
            return get(res, 'data.feature_list');
          })
          .catch(() => {
            return [];
          })
      : [];
    Promise.all([p1, p2]).then(result => {
      if (shouldRequestAuth || shouldRequestGrayList) {
        const roadMap = enhancedFindUserRoadMap(result[0], result[1], roadArr);
        const newRoad = { ...road };
        if (hasLeafPaths) {
          newRoad.leafPaths = roadMap;
        } else if (hasSubPaths) {
          newRoad.subPaths = roadMap;
        }
        userRoadMap[index] = { ...newRoad };
        dispatch({
          type: 'userInfo/updateUserInfo',
          payload: {
            userRoadMap: [...userRoadMap],
          },
        });
      }
    });
  }, []);

  useLayoutEffect(() => {
    const isReferral = (get(routeProps, 'location.pathname', '') || '').startsWith('/referral');
    // 如果是内推的，需要做个处理，在 route 渲染之前，将带有 job_post_id 的 url 调整到正确的页面
    const replace = get(routeProps, 'history.replace');
    if (isReferral && replace) {
      const query = qs.parse(get(routeProps, 'location.search', {}) || {});
      if (query.job_post_id) {
        replace({
          pathname: '/referral/position',
          search: `?job_post_id=${query.job_post_id}`,
        });
      } else if (query.referral_id) {
        replace({
          pathname: '/referral/position/share',
          search: `?referral_id=${query.referral_id}`,
        });
      }
    }
  }, []);

  const loadingEl = <Loading show className="page-loading" size={64} />;
  const isReferral = (get(routeProps, 'location.pathname', '') || '').startsWith('/referral');
  const isReferralShareFormPage = (get(routeProps, 'location.pathname', '') || '').startsWith(
    '/referral/position/share',
  );

  return (
    <>
      <SubSiderControl sider={routes} {...routeProps} />
      <main
        className={classnames('zyk-route-content', {
          // 针对内推系统做loading样式调整
          'referral-system': isReferral,
          'referral-share-form': isReferralShareFormPage,
        })}
      >
        <Suspense fallback={loadingEl}>
          <Routes routes={routes} />
        </Suspense>
      </main>
    </>
  );
};

export default isolatePage(UndertakeRoute);
