/**
 * Created by ink on 2018/4/9.
 */
import { createStore } from 'redux';
import { ConfigStore } from 'index';

let configureStore: ConfigStore;
configureStore = (reducers, initialState = {}, enhancer) => {
  const store = createStore(reducers, initialState, enhancer);
  return store;
}
export default configureStore;
