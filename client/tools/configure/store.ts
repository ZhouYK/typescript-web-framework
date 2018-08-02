import { ConfigStore } from 'index';
let configureStore: ConfigStore;
if (process.env.NODE_ENV === 'development') {
  configureStore = require('./store.local').default;
} else {
  configureStore = require('./store.prod').default;
}
export default configureStore;
