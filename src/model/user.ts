import { gluer } from 'femo';
import { User } from '@src/api/interface';

const initialUserInfo: User.BasicInfo = null;
const user = gluer(initialUserInfo);

export default user;
