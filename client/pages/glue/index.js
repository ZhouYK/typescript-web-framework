import { destruct } from 'glue-redux';
import demo from '../Demo/glue';
import store from '../../store/index';
const { dispatch } = store;
const destructor = destruct({ dispatch })({
    // 此处添加新的模块的reducer
    demo,
});
const { reducers } = destructor;
export default reducers;
//# sourceMappingURL=index.js.map