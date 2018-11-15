/**
 * Created by ink on 2018/4/10.
 */
import { applyMiddleware, Reducer } from 'redux';
import { middleware } from './common';
import genStore from '../storeGen/store';

const defaultReducer = () => ({});
const store = (reducers: Reducer<any> = defaultReducer) => {
  const middlewares = [...middleware];
  return genStore(
    reducers,
    {},
    applyMiddleware(...middlewares),
  );
};
export default store;
