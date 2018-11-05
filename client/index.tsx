import React from 'react';
import { render } from 'react-dom';
import { combineReducers } from 'redux';
import Root from './top/Root/index';
import App from './top/App/index';
import reducers from './reducers/index';
import store, { history } from './store/index';

store.replaceReducer(combineReducers(reducers));
render(
  <Root store={store} history={history} component={App} />,
  document.getElementById('bd'),
);
