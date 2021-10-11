// import {
//   get,
// } from '@src/tools/request';
// import User from '@src/commonModelService/user/interface';
// import { commonApiUrls } from './urls';

export const commonApiActions = {
  // 获取用户信息
  // getUserInfo: () => get<User.BasicInfo>(commonApiUrls.userInfo, {}, { showBizError: false, showHttpError: false }),
  getUserInfo: () => Promise.resolve({ data: '有信息' }),
};
