import { gluer } from 'femo';
import User from '@src/models/user/interface';

const initialUserInfo: User.BasicInfo = null;
const model = gluer(initialUserInfo);

export default model;
