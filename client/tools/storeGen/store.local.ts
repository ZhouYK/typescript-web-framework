/**
 * Created by ink on 2018/4/9.
 */
import { createStore, compose, StoreEnhancer, Reducer } from 'redux';
import DevTools from '../devTools/index';
const genStore = (reducers: Reducer<any>, initialState = {}, enhancer: StoreEnhancer<any>) => {
  const innerEnhancer: StoreEnhancer<{}> = compose(
    enhancer,
    DevTools().instrument(),
  );
  const store = createStore(reducers, initialState, innerEnhancer);
  return store;
};
export default genStore;
