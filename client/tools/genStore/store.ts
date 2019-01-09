import { Reducer, Store, StoreEnhancer } from 'redux';

interface GenStore {
  (reducers: Reducer<any>, initialState: {}, enhancer: StoreEnhancer<any>): Store<any>;
}
let genStore: GenStore;
if (process.env.NODE_ENV === 'development') {
  genStore = require('./store.local').default;
} else {
  genStore = require('./store.prod').default;
}
export default genStore;
