import { isArray, isSet, isString, isNumber } from 'lodash';
import { Permission, QueryRoad, RoadMap } from '../pages/pagesRoadMap';
import { GrayFeature } from '../pages/grayFeature';

export const permissionCheck = (permissions: Permission = [], purviews: { [index: string]: boolean }) => {
  // 如果节点权限为undefined或者空数组，则认为该节点不需要权限即可看见
  if (!permissions || (!(permissions as any[]).length && !(permissions as Set<any>).size)) {
    return true;
  }
  const iteratorFn = (per: Permission): boolean => {
    if (isString(per) || isNumber(per)) {
      return !!purviews[per];
    }
    // 如果是数组，那么表示内部权限码是'且'的关系，需要全部为真才代表有权限
    if (isArray(per)) {
      return per.every((p: Permission) => {
        return !!iteratorFn(p);
      });
    }
    // 为了保险起见，增加了特征函数判断
    // 如果是Set，那么表示内部权限码是'或'的关系，只要有一个为真就代表有权限
    // @ts-ignore
    if (isSet(per) || (per && typeof per.has === 'function')) {
      const temp = Array.from(per);
      return temp.some((p: Permission) => {
        return !!iteratorFn(p);
      });
    }
    // 如果传入了不合法的权限，出于安全考虑一律返回false
    return false;
  };
  return iteratorFn(permissions);
};

// 权限过滤
export const findUserPathRoadMap = (
  purviews: { [index: string]: boolean },
  roadMap: (RoadMap | QueryRoad)[],
  traverse: boolean = true,
) => {
  return roadMap.reduce((pre: any[], cur) => {
    // @ts-ignore
    const { permissions, subPaths, leafPaths, queries } = cur;
    const curPermissions: Permission = permissions || [];
    let temp = { ...cur };
    const flag = permissionCheck(curPermissions, purviews);
    if (!flag) {
      // 将没有权限的页面路由置为不可见，而不是直接从最终生成的pagesRoadMap中删除
      // 因为可能需要无权限的路由承担fallback的职责
      temp.visible = false;
      // temp.access = false;
    } else if (curPermissions && Array.from(curPermissions).length !== 0) {
      // 有权限控制的才做visible和access的赋值操作
      temp.visible = true;
      // temp.access = true;
    }

    if (traverse) {
      if (!subPaths || subPaths.length === 0) {
        temp = { ...temp, permissions: curPermissions };
      } else {
        const nextSubPaths = findUserPathRoadMap(purviews, subPaths);
        temp = { ...temp, permissions: curPermissions, subPaths: nextSubPaths };
      }

      if (!leafPaths || leafPaths.length === 0) {
        temp = { ...temp, permissions: curPermissions };
      } else {
        const nextLeafPaths = findUserPathRoadMap(purviews, leafPaths);
        temp = { ...temp, permissions: curPermissions, leafPaths: nextLeafPaths };
      }

      if (!queries || queries.length === 0) {
        temp = { ...temp, permissions: curPermissions };
      } else {
        const nextQueries = findUserPathRoadMap(purviews, queries);
        temp = { ...temp, permissions: curPermissions, queries: nextQueries };
      }
    }
    pre.push(temp);
    return pre;
  }, []);
};

export const grayFeatureCheck = (grayFeature: GrayFeature, featureList: GrayFeature[]) => {
  // 如果灰度key不存在，则认为该功能可见
  if (!grayFeature) return true;
  return featureList.includes(grayFeature);
};

// 依据灰度结果来对pagesRoadMap进行过滤
export const filterUserRoadMapByGrayFeature = (
  featureList: GrayFeature[],
  roadMap: (RoadMap | QueryRoad)[],
  traverse: boolean = true,
) => {
  return (roadMap || []).reduce((pre: any[], cur) => {
    // @ts-ignore
    const { grayFeature, subPaths, leafPaths, queries } = cur;
    let temp = { ...cur };
    const flag = grayFeatureCheck(grayFeature, featureList);
    if (!flag) {
      // 将没有权限的页面路由置为不可见，而不是直接从最终生成的pagesRoadMap中删除
      // 因为可能需要无权限的路由承担fallback的职责
      temp.visible = false;
      // temp.access = false;
    } else if (grayFeature) {
      // 有灰度控制的才做visible和access的赋值操作
      temp.visible = true;
      // temp.access = true;
    }

    if (traverse) {
      if (!subPaths || subPaths.length === 0) {
        temp = { ...temp };
      } else {
        const nextSubPaths = filterUserRoadMapByGrayFeature(featureList, subPaths);
        temp = { ...temp, subPaths: nextSubPaths };
      }

      if (!leafPaths || leafPaths.length === 0) {
        temp = { ...temp };
      } else {
        const nextLeafPaths = filterUserRoadMapByGrayFeature(featureList, leafPaths);
        temp = { ...temp, leafPaths: nextLeafPaths };
      }

      if (!queries || queries.length === 0) {
        temp = { ...temp };
      } else {
        const nextQueries = filterUserRoadMapByGrayFeature(featureList, queries);
        temp = { ...temp, queries: nextQueries };
      }
    }
    pre.push(temp);
    return pre;
  }, []);
};

// 同时进行权限和灰度的筛选
export const enhancedFindUserRoadMap = (
  purviews: { [index: string]: boolean },
  featureList: GrayFeature[],
  roadMap: (RoadMap | QueryRoad)[],
  traverse: boolean = true,
) => {
  return (roadMap || []).reduce((pre: any[], cur: RoadMap | QueryRoad) => {
    // @ts-ignore
    const { grayFeature, permissions, subPaths, leafPaths, queries } = cur;
    const curPermissions: Permission = permissions || [];
    let temp = { ...cur };
    const flagPermission = permissionCheck(curPermissions, purviews);
    const flagGrayFeature = grayFeatureCheck(grayFeature, featureList);
    // 权限和灰度任一一个不为true，都不可见
    if (!flagPermission || !flagGrayFeature) {
      // 将没有权限的页面路由置为不可见，而不是直接从最终生成的pagesRoadMap中删除
      temp.visible = false;
      // temp.access = false;
    } else if ((curPermissions && Array.from(curPermissions).length !== 0) || grayFeature) {
      // 有权限控制或有灰度控制的才做visible的赋值操作
      temp.visible = true;
      // temp.access = true;
    }

    if (traverse) {
      if (!subPaths || subPaths.length === 0) {
        temp = { ...temp, permissions: curPermissions };
      } else {
        const nextSubPaths = enhancedFindUserRoadMap(purviews, featureList, subPaths);
        temp = { ...temp, permissions: curPermissions, subPaths: nextSubPaths };
      }

      if (!leafPaths || leafPaths.length === 0) {
        temp = { ...temp, permissions: curPermissions };
      } else {
        const nextLeafPaths = enhancedFindUserRoadMap(purviews, featureList, leafPaths);
        temp = { ...temp, permissions: curPermissions, leafPaths: nextLeafPaths };
      }

      if (!queries || queries.length === 0) {
        temp = { ...temp, permissions: curPermissions };
      } else {
        const nextQueries = enhancedFindUserRoadMap(purviews, featureList, queries);
        temp = { ...temp, permissions: curPermissions, queries: nextQueries };
      }
    }
    pre.push(temp);
    return pre;
  }, []);
};
