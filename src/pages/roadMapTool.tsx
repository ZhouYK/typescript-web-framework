import pagesRoadMap from '@src/pages/roadMap';
import { RoadMap, RoadMapModuleType } from '@src/interface';

export const extractPagesRoadMapAsArray = (roads: RoadMapModuleType = pagesRoadMap()): RoadMap[] => Object.values(roads);
export const extractPagesRoadMapKeys = (roads: RoadMapModuleType = pagesRoadMap()): string[] => Object.keys(roads);
