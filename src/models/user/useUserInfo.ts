import { useModel } from 'femo';
import model from './model';

const useUserInfo = () => {
  const [info] = useModel(model);
  return info;
};

export default useUserInfo;
