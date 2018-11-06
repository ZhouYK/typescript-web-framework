import { routerReducer } from 'react-router-redux';
import models from '../pages/models';

const reducers = {
  router: routerReducer,
  ...models,
};
export default reducers;
