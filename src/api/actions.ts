import {
  get,
} from '@src/tools/request';
import { ApiResult } from '@src/tools/request/interface';
import {
  User,
} from '@src/api/interface';
import apiUrls from './urls';


export const common = {
  // 获取用户信息
  getUserInfo: (): Promise<ApiResult<User.SummaryInfo>> => get(apiUrls.userInfo, {}, { showBizError: false, showHttpError: false }),
};
