import { useModel } from 'femo';
import model from './model';

const useCurrentRoad = () => {
  const [road] = useModel(model);
  return road;
};

export default useCurrentRoad;
