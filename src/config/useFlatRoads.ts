import { RoadMap, RoadMapType } from '@/config/interface';
import { gluer, useModel } from 'femo';
import roads from './roads';

const completeFn = (roads: RoadMap[], p?: string[], parent?: RoadMap) => {
  const path = p || [];
  let hasLivingRoadInSubRoads = false;
  const result = roads.map((item) => {
    const tempItem = {
      ...item,
    };
    path.push(tempItem.path);
    const keyPath = path.join('');
    // mutable方式增加parent，便于通过匹配的精确路由回溯
    tempItem.parent = parent;
    const {
      hasSider, hasHeader, fallback, type,
    } = tempItem;
    if (typeof hasSider !== 'boolean') {
      tempItem.hasSider = parent?.hasSider ?? true;
    }
    if (typeof hasHeader !== 'boolean') {
      tempItem.hasHeader = parent?.hasHeader ?? true;
    }
    if (typeof fallback !== 'function') {
      tempItem.fallback = parent?.fallback;
    }
    // 设置默认值为 living
    if (type !== RoadMapType.living && type !== RoadMapType.fallen) {
      tempItem.type = parent?.type ?? RoadMapType.living;
    }

    if (!hasLivingRoadInSubRoads && tempItem.type === RoadMapType.living) {
      hasLivingRoadInSubRoads = true;
    }
    tempItem.completePath = keyPath;
    if (tempItem.subRoads && tempItem.subRoads.length !== 0) {
      tempItem.subRoads = completeFn(tempItem.subRoads, path, tempItem);
    }
    path.pop();
    return tempItem;
  });
  if (parent) {
    parent.hasLivingRoadInSubRoads = hasLivingRoadInSubRoads;
  }
  return result;
};

// 扁平的RoadMap，是roadMap的缓存
// 不要直接更新这个flatRoadMap
// 请更新roadMap来达到更新flagRoadMap的目的
const flatRoadMap = gluer<RoadMap[]>(completeFn(Object.values(roads())));
flatRoadMap.watch([roads], (result) => completeFn(Object.values(result[0])));

const useFlatRoads = () => {
  const [frm] = useModel(flatRoadMap);
  return frm;
};

export default useFlatRoads;
