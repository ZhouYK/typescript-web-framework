import { get, makeRequestCached } from '@src/tools/request';

// 招聘需求 的 职位列表缓存
export const getJobListCached = makeRequestCached(get);

// 通用的 职位列表缓存
export const getCommonJobListCached = makeRequestCached(get);

// 集团所有公司列表
export const getCommonCompanyListCached = makeRequestCached(get);
