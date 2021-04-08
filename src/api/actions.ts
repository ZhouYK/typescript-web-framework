import {
  get,
} from '@src/tools/request';
import {
  User,
} from '@src/api/interface';
import { commonUrls } from './urls';


export const common = {
  // 获取用户信息
  // getUserInfo: () => get<User.BasicInfo>(commonUrls.userInfo, {}, { showBizError: false, showHttpError: false }),
  getUserInfo: () => Promise.resolve(),
};
