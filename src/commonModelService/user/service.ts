import model from '@src/commonModelService/user/model';
import { commonApiActions } from '@src/api/actions';
import { getSafe } from '@src/tools/util';

const getUserInfo = () => model.race(() => commonApiActions.getUserInfo().then((res) => getSafe(res, 'data')).catch(() => null));

export default {
  getUserInfo,
};
