/**
 * Created by ink on 2018/4/9.
 */
import { createStore, compose, StoreEnhancer } from 'redux';
import { ConfigStore } from 'index';
import DevTools from '../devTools/index';
let configureStore: ConfigStore;
configureStore = (reducers, initialState = {}, enhancer) => {
  const innerEnhancer: StoreEnhancer<{}> = compose(
    enhancer,
    DevTools().instrument(),
  );
  const store = createStore(reducers, initialState, innerEnhancer);
  return store;
};
export default configureStore;
