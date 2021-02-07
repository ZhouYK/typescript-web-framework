import { gluer } from 'femo';
import { User } from '@src/api/interface';

const initialUserInfo: User.SummaryInfo = null;
//   {
//   user_info: {
//     name: '张三',
//     email: '',
//     thumbnail: '',
//   },
//   permissions: {
//     tech_auth_manage: {
//       group_auth: false,
//       sub_permits: {},
//     },
//     hr_manage: {
//       group_auth: false,
//       sub_permits: {
//       },
//     },
//     my_account_info: {
//       group_auth: false,
//       sub_permits: {
//       },
//     },
//   },
// };
const info = gluer(initialUserInfo);

export default {
  info,
};
