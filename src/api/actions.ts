// import {
//   get,
// } from '@/tools/request';
// import User from '@/commonModelService/user/interface';
// import { commonApiUrls } from './urls';

export const commonApiActions = {
  // 获取用户信息
  // getUserInfo: () => get<User.BasicInfo>(commonApiUrls.userInfo, {}, { showBizError: false, showHttpError: false }),
  getUserInfo: () => Promise.resolve({ data: '有信息' }),
};
