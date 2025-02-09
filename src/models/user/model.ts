import { glue } from 'femo';
import User from '@/models/user/interface';

const initialUserInfo: User.BasicInfo = null;
const model = glue(initialUserInfo);

export default model;
