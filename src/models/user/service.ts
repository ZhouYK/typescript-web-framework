import model from '@src/models/user/model';
import { commonApiActions } from '@src/api/actions';

const getUserInfo = () => model.race(() => commonApiActions.getUserInfo().then((res) => res?.data).catch(() => null));

export default {
  getUserInfo,
};
