import { commonApiActions } from '@/api/actions';

const getUserInfo = () => commonApiActions.getUserInfo().then((res) => res?.data).catch(() => null);

export default {
  getUserInfo,
};
