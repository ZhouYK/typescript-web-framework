import { routerReducer } from 'react-router-redux';
import reducers from '../pages/glue/index';
const reducer = Object.assign({ router: routerReducer }, reducers);
export default reducer;
//# sourceMappingURL=index.js.map