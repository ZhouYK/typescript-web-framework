import { routerReducer } from 'react-router-redux';
import reducers from '../pages/glue/index';

const reducer = {
  router: routerReducer,
  ...reducers,
};
export default reducer;
