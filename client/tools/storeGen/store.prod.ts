/**
 * Created by ink on 2018/4/9.
 */
import { Reducer, StoreEnhancer, createStore } from 'redux';

const genStore = (reducers: Reducer<any>, initialState = {}, enhancer: StoreEnhancer<any>) => {
  const store = createStore(reducers, initialState, enhancer);
  return store;
};
export default genStore;
